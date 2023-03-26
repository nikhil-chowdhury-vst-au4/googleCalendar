const { ResponseBuilder } = require('base-packages');
import CommonService from '../../../utils/common.service';
import { SUCCESS_200 } from '../../../../config/constants/errorMessages';
import ServiceDetails from '../../../../models/serviceDetails';
import Customer from '../../../../models/customer';
import Payments from '../../../../models/payment';
import userService from '../../user/services/user.service';
import getPMSTokenForFrontend from '../../../utils/razorpay/generate.frontend.token';
import * as moment from 'moment';
import createSignature from '../../../utils/razorpay/generate.signature';
import BankDetails from '../../../../models/bankDetails';
import BookingDetails from '../../../../models/bookingDetails';
import TransferDetails from '../../../../models/transfer.details';
import User from '../../../../models/user';
const axios = require('axios');

class OrderService extends CommonService {
    async createOrder(data: any) {
        try {
            const {
                name,
                mobile,
                email,
                query = '',
                sellerId,
                serviceId,
                bookingDate,
                returnUrl = 'https://meetpro.club/bookSlot/checkoutPage'
            } = data;
            console.log(data);
            const [service, bankDetails, creator] = await Promise.all([
                ServiceDetails.findOne({
                    where: {
                        id: serviceId
                    },
                    raw: true
                }),
                BankDetails.findOne({
                    where: {
                        userId: sellerId
                    },
                    raw: true
                }),
                User.findOne({
                    where: {
                        id: sellerId
                    },
                    attributes: ['commissionPercentage']
                })
            ]);

            if (!service) {
                return new ResponseBuilder(
                    400,
                    {},
                    'Service not found, please try again'
                );
            }

            const customer = await Customer.create({
                name,
                mobile,
                email,
                query
            });
            const payment = await Payments.create({
                buyerId: customer.id,
                sellerId: sellerId,
                amount: service.price,
                status: 'Initiated',
                commission: 0,
                transactionId: String(customer.id) + Date.now().toString()
            });
            if (!service.price) {
                console.log(payment, bookingDate);

                const eventResponse = await userService.createEvent(
                    serviceId,
                    sellerId,
                    bookingDate,
                    customer.email,
                    payment.id,
                    query,
                    service.duration,
                    service.title,
                    null,
                    customer.name
                );

                if (!eventResponse) {
                    await Payments.update(
                        { status: 'Failed' },
                        {
                            where: {
                                id: payment.id
                            }
                        }
                    );

                    return new ResponseBuilder(
                        400,
                        {
                            payment,
                            bookingId: eventResponse
                                ? eventResponse.bookingId
                                : null
                        },
                        'something went wrong'
                    );
                }
                eventResponse &&
                    eventResponse.bookingId &&
                    (await Payments.update(
                        {
                            status: 'Success',
                            bookingId: eventResponse.bookingId
                        },
                        {
                            where: {
                                id: payment.id
                            }
                        }
                    ));
                console.log(eventResponse);
                return new ResponseBuilder(
                    200,
                    {
                        payment: {
                            ...payment['datavalues'],
                            status: 'Success'
                        },
                        bookingId: eventResponse.bookingId,
                        name,
                        email,
                        amount: service.price * 100
                    },
                    SUCCESS_200
                );
            }
            let feToken = await getPMSTokenForFrontend({
                returnUrl: returnUrl,
                gatewayCode: 'rzp',
                orderId: payment.transactionId
            });
            let completeUrl = `${process.env.PMS_CHECKOUT_URL}/pending?region=IN&token=${feToken}&defaultLanguage=en&clientCode=meetpro&orgId=${sellerId}&color=blue`;

            let base64data = '';
            let failureUrl = null;
            if (returnUrl) {
                failureUrl = returnUrl.includes('?')
                    ? returnUrl +
                      `&paymentStatus=failed&region=IN&orderId=${payment.transactionId}`
                    : returnUrl +
                      `?paymentStatus=failed&region=IN&orderId=${payment.transactionId}`;
                let buff = Buffer.from(failureUrl);
                base64data = buff.toString('base64');
            }
            console.debug('ORDER', returnUrl, failureUrl);

            let errorUrl = `${process.env.PMS_CHECKOUT_URL}/failure?region=IN&defaultLanguage=en&clientCode=meetpro&orgId=${sellerId}&color=blue&encodedFailureUrl=${base64data}`;
            const orderData = await this.createOrderOnPMS({
                amount: service.price,
                sellerId,
                name,
                email,
                customerId: customer.id,
                completeUrl,
                errorUrl,
                transactionId: payment['dataValues'].transactionId,
                accountId: bankDetails.accountId,
                commission: creator.commissionPercentage
            });
            let jwtSignedTokenForOrderStatus = await getPMSTokenForFrontend({
                paymentSource: 'one_to_one_meet',
                gatewayCode: 'rzp',
                prefillData: {
                    name,
                    contact: mobile,
                    email: email
                },
                userId: customer.id,
                orderId: payment['dataValues'].transactionId,
                gatewayOrderId: orderData.gatewayOrderId,
                returnUrl,
                orgImageUrl:
                    'https://storage.googleapis.com/instalearn/meetProFinal%20(1).svg'
            });
            // create booking with slot information
            const cloneTime = moment(bookingDate).clone();
            const startTime = cloneTime.format('YYYY-MM-DDTHH:mm:ss+05:30');
            const endTime = cloneTime
                .add(service.duration, 'minutes')
                .format('YYYY-MM-DDTHH:mm:ss+05:30');
            const booking = await BookingDetails.create({
                sellerId,
                serviceId,
                bookingDate: bookingDate,
                from: moment(startTime).toDate(),
                to: moment(endTime).toDate(),
                status: 'pending'
            });
            let completePaymentUrl = `${process.env.PMS_CHECKOUT_URL}?region=IN&token=${jwtSignedTokenForOrderStatus}&defaultLanguage=en&clientCode=meetpro&orgId=${sellerId}&color=blue`;
            console.log(orderData);
            await Payments.update(
                {
                    orderId: orderData.gatewayOrderId,
                    bookingId: booking.id,
                    commission: orderData.commisionAmount
                },
                {
                    where: {
                        id: payment['dataValues'].id
                    }
                }
            );
            console.log('Complete Payment URL', completePaymentUrl);
            return new ResponseBuilder(
                200,
                {
                    completePaymentUrl,
                    orderId: orderData.gatewayOrderId,
                    bookingId: booking.id,
                    ...payment['dataValues']
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async createOrderOnPMS(data: any) {
        try {
            const {
                amount,
                sellerId,
                name,
                email,
                customerId,
                completeUrl,
                errorUrl,
                transactionId,
                accountId,
                commission
            } = data;
            let tempTime = moment().add(1, 'days');
            let holdTimeInMiliseconds = tempTime.valueOf();
            let comissionValue = commission
                ? Number(((amount * commission) / 100).toFixed(2))
                : 0;
            let tutorAmount = amount - comissionValue;

            const payload = {
                region: 'IN',
                amount: amount,
                orgId: sellerId,
                buyerUserId: customerId,
                sellerUserId: sellerId,
                buyerUserName: name,
                buyerUserEmail: email,
                clientCode: 'meetpro',
                gatewayCode: 'rzp',
                currency: 'INR',
                orderInfo: {
                    source: 'one_to_one_meet',
                    clientOrderId: transactionId,
                    deviceType: 'web'
                },
                completeUrl: completeUrl,
                errorUrl: errorUrl,
                orderId: transactionId,
                buyerUserType: '1',
                transferDetails: [
                    {
                        account: accountId,
                        amount: tutorAmount,
                        currency: 'INR',
                        on_hold: 1,
                        commission: 0,
                        notes: {
                            orderId: transactionId,
                            source: 'one_to_one_meet',
                            transferType: 'owner',
                            cpShare: comissionValue,
                            orgId: sellerId,
                            clientCode: 'meetpro',
                            region: 'IN',
                            env: process.env.PMS_TRANSFER_ENV
                        },
                        on_hold_until: Math.round(holdTimeInMiliseconds / 1000)
                    }
                ]
            };
            const signature = createSignature();
            const orderCreationResponse = await axios({
                method: 'POST',
                url: `${process.env.PMS_SERVIE}v1/payment/order`,
                headers: {
                    authorization: `Authorization ${signature}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(payload)
            });

            console.log(
                'OrderCreation response from PMS',
                orderCreationResponse.data
            );

            if (
                orderCreationResponse &&
                orderCreationResponse.status == 201 &&
                orderCreationResponse.data &&
                orderCreationResponse.data.data
            ) {
                return {
                    gatewayOrderId:
                        orderCreationResponse.data.data.paymentOrderId,
                    gatewayCode: orderCreationResponse.data.data.gatewayCode,
                    paymentLink: orderCreationResponse.data.data.paymentLink,
                    commisionAmount: comissionValue
                };
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getOrderStatus(orderId: string) {
        try {
            const payment = await Payments.findOne({
                where: {
                    transactionId: orderId
                },
                raw: true
            });

            if (!payment) {
                return new ResponseBuilder(400, {}, 'Wrong Order Id');
            }
            return new ResponseBuilder(200, { payment }, SUCCESS_200);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async giveAccessForPayment(data: any) {
        try {
            const {
                gatewayOrderId = null,
                event,
                gatewayPaymentId,
                paymentOrderId = null
            } = data;
            // if (!gatewayOrderId) {
            //     return false;
            // }
            const payment = await Payments.findOne({
                where: {
                    orderId: gatewayOrderId || paymentOrderId
                },
                raw: true
            });
            if (!payment) {
                console.log('payment not found', data);
                throw new Error('Wrong Order Id');
            }
            if (
                (payment.status === 'Success' || payment.status === 'Failed') &&
                data.event !== 'transfer_processed'
            ) {
                console.log('same payment again', gatewayOrderId);
                return false;
            }
            console.log('Webhook Console', gatewayOrderId, event, payment);
            switch (data.event) {
                case 'payment_captured':
                    const [booking, customer] = await Promise.all([
                        BookingDetails.findOne({
                            where: {
                                id: payment.bookingId
                            },
                            raw: true
                        }),
                        Customer.findOne({
                            where: {
                                id: payment.buyerId
                            },
                            raw: true
                        })
                    ]);
                    const service = await ServiceDetails.findOne({
                        where: {
                            id: booking.serviceId
                        },
                        raw: true
                    });
                    console.table(booking);
                    console.table(customer);
                    console.table(service);

                    await userService.createEvent(
                        booking.serviceId,
                        payment.sellerId,
                        moment(booking.from)
                            .utcOffset(330)
                            .format('YYYY-MM-DDTHH:mm'),
                        customer.email,
                        payment.id,
                        customer.query,
                        service.duration,
                        service.title,
                        booking.id,
                        customer.name
                    );
                    await Payments.update(
                        {
                            status: 'Success',
                            paymentDetails: JSON.stringify(data),
                            paymentId: gatewayPaymentId
                        },
                        {
                            where: {
                                id: payment.id
                            }
                        }
                    );

                    break;
                case 'payment_failed':
                    await BookingDetails.update(
                        {
                            status: 'failed'
                        },
                        {
                            where: {
                                id: payment.bookingId
                            }
                        }
                    );
                    await Payments.update(
                        {
                            status: 'Failed',
                            paymentDetails: JSON.stringify(data)
                        },
                        {
                            where: {
                                id: payment.id
                            }
                        }
                    );

                    break;
                case 'transfer_processed':
                    console.log(
                        'transfer payload',
                        paymentOrderId,
                        data.gatewayTransferId,
                        payment,
                        data.transferAmount
                    );
                    const transfer = await TransferDetails.create({
                        orderId: paymentOrderId,
                        transferId: data.gatewayTransferId,
                        accountId: data.gatewayAccountId,
                        paymentId: payment.id,
                        amount: data.transferAmount,
                        transferDetails: JSON.stringify(data),
                        error: JSON.stringify(data.error),
                        status: 'Processed'
                    });
                    console.table(transfer);
                    break;
                default:
                    break;
            }
            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async addBookingAnswers(data: any) {
        try {
            const { bookingId, answers } = data;
            const actualanswers = answers.filter(
                (answer) => answer.question !== 'Your LinkedIn URL?'
            );
            const linkedinQuestions = answers.filter(
                (answer) => answer.question === 'Your LinkedIn URL?'
            );
            console.log(linkedinQuestions);
            if (linkedinQuestions.length && linkedinQuestions[0].answer) {
                const booking = await Payments.findOne({
                    where: {
                        bookingId: bookingId
                    },
                    attributes: ['buyerId'],
                    raw: true
                });
                await Customer.update(
                    {
                        linkedinUrl: linkedinQuestions[0].answer
                    },
                    {
                        where: {
                            id: booking.buyerId
                        }
                    }
                );
            }
            return await BookingDetails.update(
                {
                    answers: JSON.stringify(actualanswers)
                },
                {
                    where: {
                        id: bookingId
                    }
                }
            );
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
export default new OrderService();
