"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { ResponseBuilder } = require('base-packages');
const common_service_1 = require("../../../utils/common.service");
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const serviceDetails_1 = require("../../../../models/serviceDetails");
const customer_1 = require("../../../../models/customer");
const payment_1 = require("../../../../models/payment");
const user_service_1 = require("../../user/services/user.service");
const generate_frontend_token_1 = require("../../../utils/razorpay/generate.frontend.token");
const moment = require("moment");
const generate_signature_1 = require("../../../utils/razorpay/generate.signature");
const bankDetails_1 = require("../../../../models/bankDetails");
const bookingDetails_1 = require("../../../../models/bookingDetails");
const transfer_details_1 = require("../../../../models/transfer.details");
const user_1 = require("../../../../models/user");
const axios = require('axios');
class OrderService extends common_service_1.default {
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, mobile, email, query = '', sellerId, serviceId, bookingDate, returnUrl = 'https://meetpro.club/bookSlot/checkoutPage' } = data;
                console.log(data);
                const [service, bankDetails, creator] = yield Promise.all([
                    serviceDetails_1.default.findOne({
                        where: {
                            id: serviceId
                        },
                        raw: true
                    }),
                    bankDetails_1.default.findOne({
                        where: {
                            userId: sellerId
                        },
                        raw: true
                    }),
                    user_1.default.findOne({
                        where: {
                            id: sellerId
                        },
                        attributes: ['commissionPercentage']
                    })
                ]);
                if (!service) {
                    return new ResponseBuilder(400, {}, 'Service not found, please try again');
                }
                const customer = yield customer_1.default.create({
                    name,
                    mobile,
                    email,
                    query
                });
                const payment = yield payment_1.default.create({
                    buyerId: customer.id,
                    sellerId: sellerId,
                    amount: service.price,
                    status: 'Initiated',
                    commission: 0,
                    transactionId: String(customer.id) + Date.now().toString()
                });
                if (!service.price) {
                    console.log(payment, bookingDate);
                    const eventResponse = yield user_service_1.default.createEvent(serviceId, sellerId, bookingDate, customer.email, payment.id, query, service.duration, service.title, null, customer.name);
                    if (!eventResponse) {
                        yield payment_1.default.update({ status: 'Failed' }, {
                            where: {
                                id: payment.id
                            }
                        });
                        return new ResponseBuilder(400, {
                            payment,
                            bookingId: eventResponse
                                ? eventResponse.bookingId
                                : null
                        }, 'something went wrong');
                    }
                    eventResponse &&
                        eventResponse.bookingId &&
                        (yield payment_1.default.update({
                            status: 'Success',
                            bookingId: eventResponse.bookingId
                        }, {
                            where: {
                                id: payment.id
                            }
                        }));
                    console.log(eventResponse);
                    return new ResponseBuilder(200, {
                        payment: Object.assign(Object.assign({}, payment['datavalues']), { status: 'Success' }),
                        bookingId: eventResponse.bookingId,
                        name,
                        email,
                        amount: service.price * 100
                    }, errorMessages_1.SUCCESS_200);
                }
                let feToken = yield (0, generate_frontend_token_1.default)({
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
                const orderData = yield this.createOrderOnPMS({
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
                let jwtSignedTokenForOrderStatus = yield (0, generate_frontend_token_1.default)({
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
                    orgImageUrl: 'https://storage.googleapis.com/instalearn/meetProFinal%20(1).svg'
                });
                const cloneTime = moment(bookingDate).clone();
                const startTime = cloneTime.format('YYYY-MM-DDTHH:mm:ss+05:30');
                const endTime = cloneTime
                    .add(service.duration, 'minutes')
                    .format('YYYY-MM-DDTHH:mm:ss+05:30');
                const booking = yield bookingDetails_1.default.create({
                    sellerId,
                    serviceId,
                    bookingDate: bookingDate,
                    from: moment(startTime).toDate(),
                    to: moment(endTime).toDate(),
                    status: 'pending'
                });
                let completePaymentUrl = `${process.env.PMS_CHECKOUT_URL}?region=IN&token=${jwtSignedTokenForOrderStatus}&defaultLanguage=en&clientCode=meetpro&orgId=${sellerId}&color=blue`;
                console.log(orderData);
                yield payment_1.default.update({
                    orderId: orderData.gatewayOrderId,
                    bookingId: booking.id,
                    commission: orderData.commisionAmount
                }, {
                    where: {
                        id: payment['dataValues'].id
                    }
                });
                console.log('Complete Payment URL', completePaymentUrl);
                return new ResponseBuilder(200, Object.assign({ completePaymentUrl, orderId: orderData.gatewayOrderId, bookingId: booking.id }, payment['dataValues']), errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    createOrderOnPMS(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, sellerId, name, email, customerId, completeUrl, errorUrl, transactionId, accountId, commission } = data;
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
                const signature = (0, generate_signature_1.default)();
                const orderCreationResponse = yield axios({
                    method: 'POST',
                    url: `${process.env.PMS_SERVIE}v1/payment/order`,
                    headers: {
                        authorization: `Authorization ${signature}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload)
                });
                console.log('OrderCreation response from PMS', orderCreationResponse.data);
                if (orderCreationResponse &&
                    orderCreationResponse.status == 201 &&
                    orderCreationResponse.data &&
                    orderCreationResponse.data.data) {
                    return {
                        gatewayOrderId: orderCreationResponse.data.data.paymentOrderId,
                        gatewayCode: orderCreationResponse.data.data.gatewayCode,
                        paymentLink: orderCreationResponse.data.data.paymentLink,
                        commisionAmount: comissionValue
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    getOrderStatus(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield payment_1.default.findOne({
                    where: {
                        transactionId: orderId
                    },
                    raw: true
                });
                if (!payment) {
                    return new ResponseBuilder(400, {}, 'Wrong Order Id');
                }
                return new ResponseBuilder(200, { payment }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    giveAccessForPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gatewayOrderId = null, event, gatewayPaymentId, paymentOrderId = null } = data;
                const payment = yield payment_1.default.findOne({
                    where: {
                        orderId: gatewayOrderId || paymentOrderId
                    },
                    raw: true
                });
                if (!payment) {
                    console.log('payment not found', data);
                    throw new Error('Wrong Order Id');
                }
                if ((payment.status === 'Success' || payment.status === 'Failed') &&
                    data.event !== 'transfer_processed') {
                    console.log('same payment again', gatewayOrderId);
                    return false;
                }
                console.log('Webhook Console', gatewayOrderId, event, payment);
                switch (data.event) {
                    case 'payment_captured':
                        const [booking, customer] = yield Promise.all([
                            bookingDetails_1.default.findOne({
                                where: {
                                    id: payment.bookingId
                                },
                                raw: true
                            }),
                            customer_1.default.findOne({
                                where: {
                                    id: payment.buyerId
                                },
                                raw: true
                            })
                        ]);
                        const service = yield serviceDetails_1.default.findOne({
                            where: {
                                id: booking.serviceId
                            },
                            raw: true
                        });
                        console.table(booking);
                        console.table(customer);
                        console.table(service);
                        yield user_service_1.default.createEvent(booking.serviceId, payment.sellerId, moment(booking.from)
                            .utcOffset(330)
                            .format('YYYY-MM-DDTHH:mm'), customer.email, payment.id, customer.query, service.duration, service.title, booking.id, customer.name);
                        yield payment_1.default.update({
                            status: 'Success',
                            paymentDetails: JSON.stringify(data),
                            paymentId: gatewayPaymentId
                        }, {
                            where: {
                                id: payment.id
                            }
                        });
                        break;
                    case 'payment_failed':
                        yield bookingDetails_1.default.update({
                            status: 'failed'
                        }, {
                            where: {
                                id: payment.bookingId
                            }
                        });
                        yield payment_1.default.update({
                            status: 'Failed',
                            paymentDetails: JSON.stringify(data)
                        }, {
                            where: {
                                id: payment.id
                            }
                        });
                        break;
                    case 'transfer_processed':
                        console.log('transfer payload', paymentOrderId, data.gatewayTransferId, payment, data.transferAmount);
                        const transfer = yield transfer_details_1.default.create({
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
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    addBookingAnswers(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, answers } = data;
                const actualanswers = answers.filter((answer) => answer.question !== 'Your LinkedIn URL?');
                const linkedinQuestions = answers.filter((answer) => answer.question === 'Your LinkedIn URL?');
                console.log(linkedinQuestions);
                if (linkedinQuestions.length && linkedinQuestions[0].answer) {
                    const booking = yield payment_1.default.findOne({
                        where: {
                            bookingId: bookingId
                        },
                        attributes: ['buyerId'],
                        raw: true
                    });
                    yield customer_1.default.update({
                        linkedinUrl: linkedinQuestions[0].answer
                    }, {
                        where: {
                            id: booking.buyerId
                        }
                    });
                }
                return yield bookingDetails_1.default.update({
                    answers: JSON.stringify(actualanswers)
                }, {
                    where: {
                        id: bookingId
                    }
                });
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
}
exports.default = new OrderService();
//# sourceMappingURL=order.service.js.map