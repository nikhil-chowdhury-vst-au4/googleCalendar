const { ResponseBuilder } = require('base-packages');
import CommonService from '../../../utils/common.service';
import {
    SUCCESS_200
    // ACCEPTED
} from '../../../../config/constants/errorMessages';
import User from '../../../../models/user';
import Availability from '../../../../models/availability';
import { Op } from 'sequelize';
import ServiceDetails from '../../../../models/serviceDetails';
import * as moment from 'moment';
import BankDetails from '../../../../models/bankDetails';
import BookingDetails from '../../../../models/bookingDetails';
import { setCalenderEvent } from '../../../../app/utils/gcloud/calender';
import Payments from '../../../../models/payment';
import createSignature from '../../../utils/razorpay/generate.signature';
const axios = require('axios');
import { getSignedUrl } from '../../../utils/gcloud/bucket.upload';
import Testimonials from '../../../../models/testimonials';
import AvailabilityConfiguration from '../../../../models/availabilityConfiguration';
import AvailabilityModifications from '../../../../models/availabilityModifications';
import sendEmail from '../../../../app/utils/emailer';
import freshchatService from '../../../../app/utils/freshchat/freshchat.service';
import Customer from '../../../../models/customer';
import CreatorMarketing from '../../../../models/creatorMarketing';
import BookingQuestions from '../../../../models/bookingQuestions';
import { sequelize } from '../../../../sequelize';

class UserService extends CommonService {
    async getUser(payload: any) {
        try {
            const [userDetails, bankDetails, paidService, availability] =
                await Promise.all([
                    this.getUserById(payload.id),
                    BankDetails.findOne({
                        where: {
                            userId: payload.id
                        }
                    }),
                    ServiceDetails.findOne({
                        where: {
                            userId: payload.id,
                            price: {
                                [Op.not]: 0
                            }
                        }
                    }),
                    await this.getUserRuleById(payload.id)
                ]);

            userDetails.socialLinks = userDetails.socialLinks
                ? JSON.parse(userDetails.socialLinks)
                : [];

            return {
                statusCode: userDetails ? 200 : 400,
                message: userDetails ? SUCCESS_200 : 'User not found',
                data: {
                    ...userDetails,
                    expertise: userDetails.expertise
                        ? userDetails.expertise.split(',')
                        : [],
                    username: userDetails.username
                        ? process.env.FE_INSTA_LEARN_DOMAIN +
                          userDetails.username
                        : null,
                    imageUrl:
                        userDetails.imageUrl ||
                        userDetails.googleUrl.replace(/s\d+/, 's2000'),
                    googleUrl: userDetails.googleUrl.replace(/s\d+/, 's2000'),
                    hasPaidOfferings: Boolean(paidService),
                    bankDetails,
                    onboardingStatus: Boolean(availability)
                }
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserRules(payload: any) {
        try {
            const userRules = await this.getUserRulesById(payload.id);

            const parsedRules = userRules.map((item) => {
                return {
                    id: item.id,
                    day: item.day,
                    isActive: item.isActive,
                    rules: JSON.parse(item.rules)
                };
            });

            return {
                statusCode: parsedRules ? 200 : 400,
                message: parsedRules ? SUCCESS_200 : 'rules not found',
                data: parsedRules
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async setAvailibilityOfUser(payload: any, user: any) {
        try {
            const alreadyAdded = await Availability.findOne({
                where: {
                    userId: user.id
                }
            });

            if (alreadyAdded) {
                return {
                    statusCode: 400,
                    message: 'Already set',
                    data: {}
                };
            }
            const creationPayload = payload.map((item) => {
                const rules = JSON.stringify(item.rules);
                return {
                    day: item.day,
                    rules,
                    isActive: item.isActive,
                    userId: user.id
                };
            });
            await Availability.bulkCreate(creationPayload);

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: creationPayload
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async editAvailibilityOfUser(payload: any, user: any) {
        try {
            const activeIds = [];

            const updateFnc = async (id, data) => {
                await Availability.update(data, {
                    where: {
                        id
                    }
                });
            };

            payload.forEach((item) => {
                activeIds.push(item.id);
                updateFnc(item.id, {
                    day: item.day,
                    rules: JSON.stringify(item.rules),
                    isActive: item.isActive
                });
            });

            await Availability.update(
                { isActive: false },
                {
                    where: {
                        id: { [Op.notIn]: activeIds },
                        userId: user.id
                    }
                }
            );

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: payload
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async getUserById(id: number) {
        try {
            const attributes = [
                'id',
                'name',
                'imageUrl',
                'googleUrl',
                'expertise',
                'username',
                'email',
                'mobile',
                'socialLinks',
                'about'
            ];
            const user = await User.findByPk(id, {
                attributes,
                raw: true
            });
            return user;
        } catch (err) {
            return null;
        }
    }

    async getUserRulesById(id: number, filter?: any) {
        try {
            const user = await Availability.findAll({
                where: {
                    userId: id,
                    ...filter
                }
            });
            return user;
        } catch (err) {
            return null;
        }
    }

    async getUserModificationsAvailability(id: number, filter?: any) {
        try {
            const dates = await AvailabilityModifications.findAll({
                where: {
                    userId: id,
                    isActive: true,
                    date: {
                        [Op.gte]: moment().utcOffset(330).format('YYYY-MM-DD')
                    },
                    ...filter
                }
            });
            return dates;
        } catch (err) {
            return null;
        }
    }

    async getUserAvailabilityConfiguration(id: number) {
        try {
            const details = await AvailabilityConfiguration.findByPk(id);
            return details;
        } catch (err) {
            return null;
        }
    }

    async getUserRuleById(id: number, filter?: any) {
        try {
            const user = await Availability.findOne({
                where: {
                    userId: id,
                    ...filter
                }
            });
            return user;
        } catch (err) {
            return null;
        }
    }

    async checkUsername(username: string) {
        try {
            const user = await User.findOne({
                where: {
                    username
                },
                attributes: ['id'],
                raw: true
            });

            return new ResponseBuilder(
                200,
                {
                    goodToUse: !(user && user.id)
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async getExpertiseAndServices() {
        try {
            const expertise = [
                {
                    id: 1,
                    name: 'Career Guidance'
                },
                {
                    id: 2,
                    name: 'Consulting'
                },
                {
                    id: 3,
                    name: 'Finance'
                },
                {
                    id: 4,
                    name: 'Product Management'
                },
                {
                    id: 5,
                    name: 'Brand & Marketing'
                },
                {
                    id: 6,
                    name: 'Tech'
                },
                {
                    id: 7,
                    name: 'Legal'
                },
                {
                    id: 8,
                    name: 'Entrepreneurship'
                },
                {
                    id: 9,
                    name: 'Sales'
                },
                {
                    id: 10,
                    name: 'HR'
                },
                {
                    id: 11,
                    name: 'Leadership coaching'
                },
                {
                    id: 12,
                    name: 'Fitness'
                },
                {
                    id: 13,
                    name: 'Astrology'
                },
                {
                    id: 14,
                    name: 'Startups'
                },
                {
                    id: 15,
                    name: 'Investments'
                },
                {
                    id: 16,
                    name: 'Design'
                }
            ];

            const services = await ServiceDetails.findAll({
                where: {
                    serviceType: 'default'
                }
            });

            return new ResponseBuilder(
                200,
                {
                    expertise,
                    services
                },
                SUCCESS_200
            );
        } catch (err) {
            throw new Error('something went wrong');
        }
    }

    async getUserSlots(userId: number, serviceId: number, lastDate: string) {
        try {
            console.log(userId);
            const [
                userRules,
                serviceDetails,
                availabilityConfiguration,
                availabilityModifications
            ] = await Promise.all([
                this.getUserRulesById(userId, {
                    isActive: 1
                }),
                ServiceDetails.findByPk(serviceId),
                this.getUserAvailabilityConfiguration(userId),
                this.getUserModificationsAvailability(userId)
            ]);

            if (
                !serviceDetails ||
                !serviceDetails.isActive ||
                serviceDetails.userId != userId
            ) {
                return {
                    statusCode: 400,
                    message: 'service not found',
                    data: {}
                };
            }

            const slotInterval = serviceDetails.duration;
            if (!userRules.length) {
                return {
                    statusCode: 200,
                    message: SUCCESS_200,
                    data: []
                };
            }
            const days = [];
            const daysMap = [];

            userRules.forEach((item) => {
                days.push(item.day);
                const rules = JSON.parse(item.rules);
                daysMap[item.day] = rules;
            });
            const result = [];

            let count = 0;

            let startDate = lastDate
                ? moment(lastDate).add(1, 'day')
                : moment().utcOffset(330);
            let maxDate =
                availabilityConfiguration && availabilityConfiguration.maxWindow
                    ? moment().add(availabilityConfiguration.maxWindow, 'days')
                    : moment().add(2, 'months');

            let visibleTimeAfterLanding =
                availabilityConfiguration &&
                availabilityConfiguration.periodValue
                    ? moment().add(
                          availabilityConfiguration.periodValue,
                          availabilityConfiguration.periodType as moment.DurationInputArg2
                      )
                    : moment().add(6, 'hours');

            while (count < 6) {
                if (days.indexOf(startDate.day()) >= 0) {
                    const currentDate = startDate.format('YYYY-MM-DD');
                    if (currentDate > maxDate.format('YYYY-MM-DD')) {
                        break;
                    }
                    const checkAlteredDate = availabilityModifications.find(
                        (x) => String(x.date) == currentDate
                    );

                    if (checkAlteredDate && !checkAlteredDate.rules) {
                        break;
                    }
                    const alteredRules = checkAlteredDate
                        ? JSON.parse(checkAlteredDate.rules)
                        : null;

                    // replace this table call with new Booking table in v2
                    const blockedTimes = await BookingDetails.findAll({
                        attributes: ['from', 'to'],
                        where: {
                            from: {
                                [Op.gte]: moment(currentDate).utcOffset(-330)
                            },
                            to: {
                                [Op.lt]: moment(currentDate)
                                    .add(1, 'day')
                                    .utcOffset(-330)
                            },
                            sellerId: userId,
                            status: { [Op.in]: ['booked'] }
                        }
                    });
                    console.table(blockedTimes);
                    const fromMap = new Set();
                    const toMap = new Set();
                    blockedTimes.forEach((entity) => {
                        fromMap.add(
                            moment(entity.from).utcOffset(330).format('HH:mm')
                        );
                        toMap.add(
                            moment(entity.to).utcOffset(330).format('HH:mm')
                        );
                    });

                    const rules: { from: string; to: string }[] =
                        alteredRules || daysMap[startDate.day()];
                    // console.log(currentDate, rules);
                    const slots = [];

                    rules.forEach((rule) => {
                        console.log('RULE', rule);

                        let startTime = moment(currentDate + 'T' + rule.from);
                        let tmpEndTime = moment(currentDate + 'T' + rule.from);
                        // let [fh, fm] = rule.from
                        //     .split(':')
                        //     .map((x) => parseInt(x));
                        // let [th, tm] = rule.to
                        //     .split(':')
                        //     .map((x) => parseInt(x));

                        // let startTime = moment(currentDate).set({
                        //     hours: fh,
                        //     minutes: fm
                        // });
                        // let tmpEndTime = moment(currentDate).set({
                        //     hours: fh,
                        //     minutes: fm
                        // });

                        // Format the end time and the next day to it
                        // let endTime = moment(currentDate).set({
                        //     hours: th,
                        //     minutes: tm
                        // });
                        let endTime = moment(currentDate + 'T' + rule.to);
                        console.log(startTime, tmpEndTime, endTime);
                        // Loop over the times - only pushes time with 30 minutes interval
                        while (
                            startTime < endTime &&
                            tmpEndTime.add(slotInterval, 'minutes') <= endTime
                        ) {
                            // Push times
                            let start = startTime.format('YYYY-MM-DDTHH:mm');
                            let push = true;
                            console.log(
                                startTime.format('HH:mm'),
                                fromMap.has(startTime.format('HH:mm'))
                            );
                            if (fromMap.has(startTime.format('HH:mm'))) {
                                push = false;
                            }
                            const startTimeCopy = startTime.clone();

                            if (
                                toMap.has(
                                    startTimeCopy
                                        .add(slotInterval, 'minutes')
                                        .format('HH:mm')
                                )
                            ) {
                                push = false;
                            }

                            start >=
                                visibleTimeAfterLanding.format(
                                    'YYYY-MM-DDTHH:mm'
                                ) &&
                                slots.push({
                                    slot: start,
                                    available: push
                                        ? !(
                                              moment(start)
                                                  .utcOffset(-330)
                                                  .format(
                                                      'YYYY-MM-DDTHH:mm:ss+00:00'
                                                  ) < moment().format()
                                          )
                                        : push
                                });
                            // Add interval of slotInteval minutes
                            startTime.add(slotInterval, 'minutes');
                            tmpEndTime = startTime.clone();
                            console.log();
                        }
                    });

                    slots.length > 1 &&
                        result.push({
                            date: currentDate,
                            slots: slots.sort(
                                (a, b) =>
                                    moment(a.slot).valueOf() -
                                    moment(b.slot).valueOf()
                            )
                        });

                    slots.length > 1 && count++;
                }
                startDate.add(1, 'day');
            }

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: {
                    serviceDetails,
                    slotData: result
                }
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async createOrUpdateProfile(data: any, userId: number) {
        try {
            const actualSocialLinks =
                data.socialLinks && data.socialLinks.length
                    ? data.socialLinks.filter(
                          (data) => data.url && data.url !== ''
                      )
                    : data.socialLinks;
            console.log(actualSocialLinks);
            const updatedUserData = {
                ...(data.username && { username: data.username }),
                ...(data.expertise && { expertise: data.expertise.join() }),
                ...(data.mobile && { mobile: data.mobile }),
                ...(data.name && { name: data.name }),
                ...(data.imageUrl && { imageUrl: data.imageUrl }),
                ...{ about: data.about },
                ...(data.socialLinks &&
                    data.socialLinks.length && {
                        socialLinks: JSON.stringify(actualSocialLinks)
                    })
            };

            await User.update(updatedUserData, {
                where: {
                    id: userId
                }
            });

            if (data.defaultServices && data.defaultServices.length) {
                await Promise.allSettled(
                    data.defaultServices.map((item) =>
                        ServiceDetails.create({
                            userId: userId,
                            title: item.title,
                            description: item.description,
                            isFree: false,
                            price: 0,
                            serviceType: 'usergenerated'
                        })
                    )
                );
            }

            return new ResponseBuilder(
                200,
                {
                    success: true
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async getLandingPageDetails(url: string) {
        try {
            const lastslash = url.length && url.lastIndexOf('/');
            const username = url.length && url.slice(lastslash + 1);

            const creatorData = await User.findOne({
                where: {
                    username: username
                },
                include: [
                    {
                        model: ServiceDetails,
                        attributes: [
                            'id',
                            'userId',
                            'description',
                            'duration',
                            'title',
                            'price',
                            'isFree',
                            'serviceType'
                        ],
                        where: {
                            isActive: true
                        }
                    }
                ]
            });
            if (!creatorData) {
                return new ResponseBuilder(400, {}, 'Wrong URL provided');
            }

            const testimonials = await Testimonials.findAll({
                where: {
                    sellerId: creatorData.id,
                    isPublished: true
                },
                include: [
                    {
                        model: ServiceDetails,
                        attributes: ['title']
                    },
                    {
                        model: Customer,
                        attributes: ['id', 'name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return new ResponseBuilder(
                200,
                {
                    creatorId: creatorData.id,
                    email: creatorData.email,
                    name: creatorData.name,
                    username: creatorData.username
                        ? process.env.FE_INSTA_LEARN_DOMAIN +
                          creatorData.username
                        : null,
                    imageUrl:
                        creatorData.imageUrl ||
                        creatorData.googleUrl.replace(/s\d+/, 's2000'),
                    expertise: creatorData.expertise.split(','),
                    about: creatorData.about,
                    socialLinks:
                        creatorData.socialLinks &&
                        creatorData.socialLinks.length
                            ? JSON.parse(creatorData.socialLinks)
                            : null,
                    serviceDetails: creatorData.serviceDetails,
                    testimonials,
                    ratings: creatorData.rating,
                    numRatings: creatorData.numRatings
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async createEvent(
        serviceId: number,
        sellerId: number,
        slot: string,
        customerEmail: string,
        paymentId: number,
        query: string,
        duration: number,
        serviceTitle: string,
        bookingId?: number,
        customerName?: string
    ) {
        try {
            const user = await User.findByPk(sellerId, {
                attributes: ['refreshToken', 'email', 'name', 'mobile']
            });

            if (!user) {
                return false;
            }
            const cloneTime = moment(slot).clone();
            const startTime = cloneTime.format('YYYY-MM-DDTHH:mm:ss+05:30');
            const endTime = cloneTime
                .add(duration, 'minutes')
                .format('YYYY-MM-DDTHH:mm:ss+05:30');

            const paylaod = {
                title: serviceTitle,
                query,
                paymentId,
                startTime,
                endTime
            };

            const userDetails = {
                refreshToken: user.refreshToken,
                email: user.email
            };
            console.table(paylaod);
            console.table(userDetails);
            console.table(customerEmail);

            const event = await setCalenderEvent(
                paylaod,
                userDetails,
                customerEmail
            );
            if (!event) {
                return false;
            }
            let booking;
            // / here update logic will be there later when we will start holding the slot by pending state

            console.log('creating booking');
            if (!bookingId) {
                booking = await BookingDetails.create({
                    sellerId,
                    serviceId,
                    bookingDate: new Date(slot),
                    iCalUID: event.iCalUID,
                    eventId: event.id,
                    meetingLink: event.hangoutLink,
                    from: moment(startTime).toDate(),
                    to: moment(endTime).toDate(),
                    status: 'booked'
                });
            } else {
                booking = await BookingDetails.update(
                    {
                        sellerId,
                        serviceId,
                        bookingDate: new Date(slot),
                        iCalUID: event.iCalUID,
                        eventId: event.id,
                        meetingLink: event.hangoutLink,
                        status: 'booked'
                    },
                    {
                        where: {
                            id: bookingId
                        }
                    }
                );
            }

            const templateData = {
                meetProLink: 'https://meetpro.club',
                date: moment(slot).format('Do MMMM YYYY, dddd'),
                time:
                    moment(startTime).utcOffset(330).format('hh:mm A') +
                    '-' +
                    moment(endTime).utcOffset(330).format('hh:mm A') +
                    ' (IST)',
                mentorName: user.name,
                offeringName: serviceTitle,
                menteeName: customerName,
                userDetails:
                    `${process.env.FE_INSTA_LEARN_DOMAIN}/calls?bookingId=` +
                    (bookingId || booking.id),
                meetingLink: event.hangoutLink
            };

            sendEmail(
                [user.email],
                process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS,
                parseInt(
                    process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS_TEMPLATE
                ),
                templateData
            );
            sendEmail(
                [customerEmail],
                'Booking Confirmed!',
                parseInt(
                    process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS_TEMPLATE
                ),
                {
                    ...templateData,
                    userDetails: ''
                }
            );
            user.mobile &&
                freshchatService.sendBookingConfirmationFreshchatServiceRequest(
                    user.name,
                    customerName,
                    serviceTitle,
                    moment(slot).format('LLLL') + ' (IST)',
                    event.hangoutLink,
                    user.mobile
                );
            const encodedLink = await this.createQueryFromBookingId(
                bookingId || booking.id
            );
            sendEmail([customerEmail], 'local test template', 38, {
                meetProLink: 'testMeetProLink',
                date: 'testDate',
                time: 'testTime',
                mentorName: 'testMentor',
                offeringName: 'testOffering',
                feedbackLink:
                    `${process.env.FE_INSTA_LEARN_DOMAIN}feedback?testimonialId=` +
                    encodedLink
            });
            return { bookingId: booking.id };
        } catch (err) {
            console.debug(err);
            return false;
        }
    }

    async deleteUser(email: string) {
        try {
            if (process.env.ENVIRONMENT == 'production') {
                return {
                    statusCode: 403,
                    message: 'This is Production, Please Stay away!!!!👮🏾‍♀️🚨',
                    data: { deleted: false }
                };
            }
            console.log(email);
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) {
                throw new Error('user not found');
            }
            const { id: userId } = user;

            await BankDetails.destroy({
                where: {
                    userId
                }
            });

            await Payments.destroy({
                where: {
                    sellerId: userId
                }
            });

            await BookingDetails.destroy({
                where: {
                    sellerId: userId
                }
            });

            await ServiceDetails.destroy({
                where: {
                    userId
                }
            });

            await Availability.destroy({
                where: {
                    userId
                }
            });

            await User.destroy({
                where: {
                    id: userId
                }
            });

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: { deleted: true }
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    async addBankDetails(data: any, userId: number) {
        try {
            const { beneficiaryName, accountNumber, IFSC, email } = data;
            console.log(beneficiaryName, accountNumber, IFSC, email, userId);

            const [token, user] = await Promise.all([
                // Create a signature to call PMS api
                createSignature(),
                User.findOne({
                    where: {
                        id: userId
                    },
                    raw: true
                })
            ]);

            console.log(token);
            // payload for PMS api
            const payload = {
                userId: userId,
                userName: user.name,
                email: email,
                gatewayCode: 'rzp',
                orgId: userId,
                orgName: user.name,
                paymentSource: 'one_to_one_meet',
                clientCode: 'meetpro',
                userType: 3,
                region: 'IN',
                currency: 'INR',
                bankDetails: {
                    accountNumber: accountNumber,
                    ifscCode: IFSC,
                    beneficiaryName: beneficiaryName
                }
            };
            const headers = {
                headers: {
                    authorization: `Authorization ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            let bankData = await axios.post(
                `${process.env.PMS_SERVIE}v1/payment/user`,
                payload,
                headers
            );
            console.log(bankData?.data);

            if (
                bankData &&
                bankData.data &&
                bankData.data.data.gatewayAccountId
            ) {
                const [userAccount] = await BankDetails.findOrCreate({
                    where: {
                        userId
                    },
                    defaults: {
                        userId,
                        beneficiaryName,
                        IFSC,
                        emailId: email,
                        accountNumber,
                        accountId: bankData.data.data.gatewayAccountId
                    },
                    raw: true
                });
                return new ResponseBuilder(200, { userAccount }, SUCCESS_200);
            }
        } catch (error) {
            console.log(error.response);
            // In case user's bank account is already mapped to a user , api throws an error.
            if (
                error.response.data &&
                error.response.data.status == 'failure'
            ) {
                return new ResponseBuilder(
                    400,
                    { ...error.response.data.data },
                    'This email id is already mapped.Please try with another email id'
                );
            }

            throw new Error(error);
        }
    }

    async uploadImage(fileExtension: string, userId: number) {
        try {
            const extension = this.extensionMapping(fileExtension);

            const BucketName = process.env.INSTALEARN_BUCKET;
            console.log(extension, BucketName);
            const destFileName =
                'user' + new Date().getTime() + '-' + userId + extension;
            console.log('BucketName', BucketName, destFileName);
            const url = await getSignedUrl(
                destFileName,
                BucketName,
                fileExtension
            );
            console.log(url);
            return new ResponseBuilder(200, url, SUCCESS_200);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getBankDetails(userId: number) {
        try {
            const bankDetails = await BankDetails.findOne({
                where: {
                    userId: userId
                }
            });
            return new ResponseBuilder(200, bankDetails || {}, SUCCESS_200);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async sendCreatorMarketingMessages(limit: number, offset: number) {
        try {
            const segment1Users = await sequelize.query({
                query: `SELECT u.email, u.name, u.mobile,  u.id, serviceCount, u.about, u.imageUrl, segment1_count
					FROM user u
					LEFT JOIN (
						SELECT userId, COUNT(*) AS segment1_count, MAX(createdAt) AS latest_segment1_entry
						FROM creatorMarketing
						WHERE segment = 1
						GROUP BY userId
					) cm ON u.id = cm.userId
					LEFT join (
					SELECT userId, COUNT(*) AS serviceCount  FROM serviceDetails
						WHERE price > 0
						GROUP BY userId
					) sd on u.id = sd.userId
					WHERE (u.imageUrl is NULL OR u.about is NULL OR serviceCount is null) 
					AND (cm.latest_segment1_entry IS NULL OR cm.latest_segment1_entry <= DATE_SUB(NOW(), INTERVAL 2 DAY)) AND (cm.segment1_count IS NULL OR cm.segment1_count <= 2 )
					ORDER BY u.updatedAt DESC LIMIT ? OFFSET ?;`,
                values: [limit, offset]
            });

            const segment2Users = await sequelize.query({
                query: `SELECT  u.email, u.mobile, u.name, u.id, segment2_count, u.updatedAt
				FROM user u
				LEFT JOIN (
					SELECT userId, COUNT(*) AS segment2_count, MAX(createdAt) AS latest_segment2_entry
					FROM creatorMarketing
					WHERE segment = 2
					GROUP BY userId
				) cm ON u.id = cm.userId
				WHERE (cm.segment2_count IS NULL OR cm.segment2_count <= 2)
				AND (cm.latest_segment2_entry IS NULL OR cm.latest_segment2_entry <= DATE_SUB(NOW(), INTERVAL 2 DAY))
				AND u.id NOT IN (SELECT DISTINCT sellerId FROM bookingDetails) ORDER BY u.updatedAt DESC
				LIMIT ? OFFSET ?;`,
                values: [limit, offset]
            });
            const response = [];
            await Promise.allSettled(
                segment1Users[0].map((data: any) =>
                    this.processEmailToSendMessages(
                        {
                            ...data,
                            segment: 1
                        },
                        response
                    )
                )
            );
            await Promise.allSettled(
                segment2Users[0].map((data: any) =>
                    this.processEmailToSendMessages(
                        {
                            ...data,
                            segment: 2
                        },
                        response
                    )
                )
            );
            return new ResponseBuilder(200, response || [], SUCCESS_200);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async processEmailToSendMessages(data, response) {
        try {
            const { email, name, segment, mobile, id } = data;

            if (segment === 1) {
                console.log('segment1');
                await freshchatService.sendSegment1FreshchatServiceRequest(
                    name,
                    mobile
                );

                await CreatorMarketing.create({
                    userId: id,
                    segment: 1
                });
                response.push({
                    email,
                    segment: 'segment1_sent'
                });
                return;
            }
            if (segment === 2) {
                console.log('segment2');

                freshchatService.sendSegment2FreshchatServiceRequest(
                    name,
                    mobile
                );

                await CreatorMarketing.create({
                    userId: id,
                    segment: 2
                });
                response.push({
                    email,
                    segment: 'segment2_sent'
                });
                return;
            }
            response.push({
                email,
                segment: 'bothSegments_skipped'
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async bookingQuestions(creatorId: string, serviceId: string) {
        try {
            const questions = await BookingQuestions.findAll({
                where: {
                    sellerId: Number(creatorId),
                    isDeleted: false,
                    serviceId: Number(serviceId)
                },
                attributes: ['id', 'question']
            });
            const linkedin: any = {
                id: 0,
                question: 'Your LinkedIn URL?'
            };
            questions.unshift(linkedin);
            return questions;
        } catch (error) {
            console.log(error);
        }
    }

    async getBookingBlockedSlots(userId: number) {
        try {
            const [userRules, availabilityModifications] = await Promise.all([
                this.getUserRulesById(userId, {
                    isActive: 1
                }),
                this.getUserModificationsAvailability(userId)
            ]);
            if (!userRules.length) {
                return {
                    statusCode: 200,
                    message: SUCCESS_200,
                    data: []
                };
            }
            const days = [];
            const daysMap = [];

            userRules.forEach((item) => {
                days.push(item.day);
                const rules = JSON.parse(item.rules);
                daysMap[item.day] = rules;
            });
            const result = [];

            let startDate = moment();
            let endDate = moment().add(1, 'months').endOf('month');

            while (startDate <= endDate) {
                const currentDay = days.indexOf(startDate.day());
                if (currentDay >= 0) {
                    const currentDate = startDate.format('YYYY-MM-DD');
                    const checkAlteredDate = availabilityModifications.find(
                        (x) => String(x.date) == currentDate
                    );

                    if (checkAlteredDate && !checkAlteredDate.rules) {
                        startDate.add(1, 'day');
                        continue;
                    }
                    const alteredRules = checkAlteredDate
                        ? JSON.parse(checkAlteredDate.rules)
                        : null;
                    result.push({
                        date: currentDate,
                        slots: alteredRules || daysMap[startDate.day()]
                    });
                }
                startDate.add(1, 'day');
            }
            return new ResponseBuilder(200, result || [], SUCCESS_200);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new UserService();
