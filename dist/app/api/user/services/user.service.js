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
const user_1 = require("../../../../models/user");
const availability_1 = require("../../../../models/availability");
const sequelize_1 = require("sequelize");
const serviceDetails_1 = require("../../../../models/serviceDetails");
const moment = require("moment");
const bankDetails_1 = require("../../../../models/bankDetails");
const bookingDetails_1 = require("../../../../models/bookingDetails");
const calender_1 = require("../../../../app/utils/gcloud/calender");
const payment_1 = require("../../../../models/payment");
const generate_signature_1 = require("../../../utils/razorpay/generate.signature");
const axios = require('axios');
const bucket_upload_1 = require("../../../utils/gcloud/bucket.upload");
const testimonials_1 = require("../../../../models/testimonials");
const availabilityConfiguration_1 = require("../../../../models/availabilityConfiguration");
const availabilityModifications_1 = require("../../../../models/availabilityModifications");
const emailer_1 = require("../../../../app/utils/emailer");
const freshchat_service_1 = require("../../../../app/utils/freshchat/freshchat.service");
const customer_1 = require("../../../../models/customer");
const creatorMarketing_1 = require("../../../../models/creatorMarketing");
const bookingQuestions_1 = require("../../../../models/bookingQuestions");
const sequelize_2 = require("../../../../sequelize");
class UserService extends common_service_1.default {
    getUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userDetails, bankDetails, paidService, availability] = yield Promise.all([
                    this.getUserById(payload.id),
                    bankDetails_1.default.findOne({
                        where: {
                            userId: payload.id
                        }
                    }),
                    serviceDetails_1.default.findOne({
                        where: {
                            userId: payload.id,
                            price: {
                                [sequelize_1.Op.not]: 0
                            }
                        }
                    }),
                    yield this.getUserRuleById(payload.id)
                ]);
                userDetails.socialLinks = userDetails.socialLinks
                    ? JSON.parse(userDetails.socialLinks)
                    : [];
                return {
                    statusCode: userDetails ? 200 : 400,
                    message: userDetails ? errorMessages_1.SUCCESS_200 : 'User not found',
                    data: Object.assign(Object.assign({}, userDetails), { expertise: userDetails.expertise
                            ? userDetails.expertise.split(',')
                            : [], username: userDetails.username
                            ? process.env.FE_INSTA_LEARN_DOMAIN +
                                userDetails.username
                            : null, imageUrl: userDetails.imageUrl ||
                            userDetails.googleUrl.replace(/s\d+/, 's2000'), googleUrl: userDetails.googleUrl.replace(/s\d+/, 's2000'), hasPaidOfferings: Boolean(paidService), bankDetails, onboardingStatus: Boolean(availability) })
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getUserRules(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRules = yield this.getUserRulesById(payload.id);
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
                    message: parsedRules ? errorMessages_1.SUCCESS_200 : 'rules not found',
                    data: parsedRules
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    setAvailibilityOfUser(payload, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const alreadyAdded = yield availability_1.default.findOne({
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
                yield availability_1.default.bulkCreate(creationPayload);
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: creationPayload
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editAvailibilityOfUser(payload, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeIds = [];
                const updateFnc = (id, data) => __awaiter(this, void 0, void 0, function* () {
                    yield availability_1.default.update(data, {
                        where: {
                            id
                        }
                    });
                });
                payload.forEach((item) => {
                    activeIds.push(item.id);
                    updateFnc(item.id, {
                        day: item.day,
                        rules: JSON.stringify(item.rules),
                        isActive: item.isActive
                    });
                });
                yield availability_1.default.update({ isActive: false }, {
                    where: {
                        id: { [sequelize_1.Op.notIn]: activeIds },
                        userId: user.id
                    }
                });
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: payload
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const user = yield user_1.default.findByPk(id, {
                    attributes,
                    raw: true
                });
                return user;
            }
            catch (err) {
                return null;
            }
        });
    }
    getUserRulesById(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield availability_1.default.findAll({
                    where: Object.assign({ userId: id }, filter)
                });
                return user;
            }
            catch (err) {
                return null;
            }
        });
    }
    getUserModificationsAvailability(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dates = yield availabilityModifications_1.default.findAll({
                    where: Object.assign({ userId: id, isActive: true, date: {
                            [sequelize_1.Op.gte]: moment().utcOffset(330).format('YYYY-MM-DD')
                        } }, filter)
                });
                return dates;
            }
            catch (err) {
                return null;
            }
        });
    }
    getUserAvailabilityConfiguration(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const details = yield availabilityConfiguration_1.default.findByPk(id);
                return details;
            }
            catch (err) {
                return null;
            }
        });
    }
    getUserRuleById(id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield availability_1.default.findOne({
                    where: Object.assign({ userId: id }, filter)
                });
                return user;
            }
            catch (err) {
                return null;
            }
        });
    }
    checkUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({
                    where: {
                        username
                    },
                    attributes: ['id'],
                    raw: true
                });
                return new ResponseBuilder(200, {
                    goodToUse: !(user && user.id)
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getExpertiseAndServices() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const services = yield serviceDetails_1.default.findAll({
                    where: {
                        serviceType: 'default'
                    }
                });
                return new ResponseBuilder(200, {
                    expertise,
                    services
                }, errorMessages_1.SUCCESS_200);
            }
            catch (err) {
                throw new Error('something went wrong');
            }
        });
    }
    getUserSlots(userId, serviceId, lastDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const [userRules, serviceDetails, availabilityConfiguration, availabilityModifications] = yield Promise.all([
                    this.getUserRulesById(userId, {
                        isActive: 1
                    }),
                    serviceDetails_1.default.findByPk(serviceId),
                    this.getUserAvailabilityConfiguration(userId),
                    this.getUserModificationsAvailability(userId)
                ]);
                if (!serviceDetails ||
                    !serviceDetails.isActive ||
                    serviceDetails.userId != userId) {
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
                        message: errorMessages_1.SUCCESS_200,
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
                let maxDate = availabilityConfiguration && availabilityConfiguration.maxWindow
                    ? moment().add(availabilityConfiguration.maxWindow, 'days')
                    : moment().add(2, 'months');
                let visibleTimeAfterLanding = availabilityConfiguration &&
                    availabilityConfiguration.periodValue
                    ? moment().add(availabilityConfiguration.periodValue, availabilityConfiguration.periodType)
                    : moment().add(6, 'hours');
                while (count < 6) {
                    if (days.indexOf(startDate.day()) >= 0) {
                        const currentDate = startDate.format('YYYY-MM-DD');
                        if (currentDate > maxDate.format('YYYY-MM-DD')) {
                            break;
                        }
                        const checkAlteredDate = availabilityModifications.find((x) => String(x.date) == currentDate);
                        if (checkAlteredDate && !checkAlteredDate.rules) {
                            break;
                        }
                        const alteredRules = checkAlteredDate
                            ? JSON.parse(checkAlteredDate.rules)
                            : null;
                        const blockedTimes = yield bookingDetails_1.default.findAll({
                            attributes: ['from', 'to'],
                            where: {
                                from: {
                                    [sequelize_1.Op.gte]: moment(currentDate).utcOffset(-330)
                                },
                                to: {
                                    [sequelize_1.Op.lt]: moment(currentDate)
                                        .add(1, 'day')
                                        .utcOffset(-330)
                                },
                                sellerId: userId,
                                status: { [sequelize_1.Op.in]: ['booked'] }
                            }
                        });
                        console.table(blockedTimes);
                        const fromMap = new Set();
                        const toMap = new Set();
                        blockedTimes.forEach((entity) => {
                            fromMap.add(moment(entity.from).utcOffset(330).format('HH:mm'));
                            toMap.add(moment(entity.to).utcOffset(330).format('HH:mm'));
                        });
                        const rules = alteredRules || daysMap[startDate.day()];
                        const slots = [];
                        rules.forEach((rule) => {
                            console.log('RULE', rule);
                            let startTime = moment(currentDate + 'T' + rule.from);
                            let tmpEndTime = moment(currentDate + 'T' + rule.from);
                            let endTime = moment(currentDate + 'T' + rule.to);
                            console.log(startTime, tmpEndTime, endTime);
                            while (startTime < endTime &&
                                tmpEndTime.add(slotInterval, 'minutes') <= endTime) {
                                let start = startTime.format('YYYY-MM-DDTHH:mm');
                                let push = true;
                                console.log(startTime.format('HH:mm'), fromMap.has(startTime.format('HH:mm')));
                                if (fromMap.has(startTime.format('HH:mm'))) {
                                    push = false;
                                }
                                const startTimeCopy = startTime.clone();
                                if (toMap.has(startTimeCopy
                                    .add(slotInterval, 'minutes')
                                    .format('HH:mm'))) {
                                    push = false;
                                }
                                start >=
                                    visibleTimeAfterLanding.format('YYYY-MM-DDTHH:mm') &&
                                    slots.push({
                                        slot: start,
                                        available: push
                                            ? !(moment(start)
                                                .utcOffset(-330)
                                                .format('YYYY-MM-DDTHH:mm:ss+00:00') < moment().format())
                                            : push
                                    });
                                startTime.add(slotInterval, 'minutes');
                                tmpEndTime = startTime.clone();
                                console.log();
                            }
                        });
                        slots.length > 1 &&
                            result.push({
                                date: currentDate,
                                slots: slots.sort((a, b) => moment(a.slot).valueOf() -
                                    moment(b.slot).valueOf())
                            });
                        slots.length > 1 && count++;
                    }
                    startDate.add(1, 'day');
                }
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: {
                        serviceDetails,
                        slotData: result
                    }
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    createOrUpdateProfile(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const actualSocialLinks = data.socialLinks && data.socialLinks.length
                    ? data.socialLinks.filter((data) => data.url && data.url !== '')
                    : data.socialLinks;
                console.log(actualSocialLinks);
                const updatedUserData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.username && { username: data.username })), (data.expertise && { expertise: data.expertise.join() })), (data.mobile && { mobile: data.mobile })), (data.name && { name: data.name })), (data.imageUrl && { imageUrl: data.imageUrl })), { about: data.about }), (data.socialLinks &&
                    data.socialLinks.length && {
                    socialLinks: JSON.stringify(actualSocialLinks)
                }));
                yield user_1.default.update(updatedUserData, {
                    where: {
                        id: userId
                    }
                });
                if (data.defaultServices && data.defaultServices.length) {
                    yield Promise.allSettled(data.defaultServices.map((item) => serviceDetails_1.default.create({
                        userId: userId,
                        title: item.title,
                        description: item.description,
                        isFree: false,
                        price: 0,
                        serviceType: 'usergenerated'
                    })));
                }
                return new ResponseBuilder(200, {
                    success: true
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getLandingPageDetails(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastslash = url.length && url.lastIndexOf('/');
                const username = url.length && url.slice(lastslash + 1);
                const creatorData = yield user_1.default.findOne({
                    where: {
                        username: username
                    },
                    include: [
                        {
                            model: serviceDetails_1.default,
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
                const testimonials = yield testimonials_1.default.findAll({
                    where: {
                        sellerId: creatorData.id,
                        isPublished: true
                    },
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['title']
                        },
                        {
                            model: customer_1.default,
                            attributes: ['id', 'name']
                        }
                    ],
                    order: [['createdAt', 'DESC']]
                });
                return new ResponseBuilder(200, {
                    creatorId: creatorData.id,
                    email: creatorData.email,
                    name: creatorData.name,
                    username: creatorData.username
                        ? process.env.FE_INSTA_LEARN_DOMAIN +
                            creatorData.username
                        : null,
                    imageUrl: creatorData.imageUrl ||
                        creatorData.googleUrl.replace(/s\d+/, 's2000'),
                    expertise: creatorData.expertise.split(','),
                    about: creatorData.about,
                    socialLinks: creatorData.socialLinks &&
                        creatorData.socialLinks.length
                        ? JSON.parse(creatorData.socialLinks)
                        : null,
                    serviceDetails: creatorData.serviceDetails,
                    testimonials,
                    ratings: creatorData.rating,
                    numRatings: creatorData.numRatings
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    createEvent(serviceId, sellerId, slot, customerEmail, paymentId, query, duration, serviceTitle, bookingId, customerName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findByPk(sellerId, {
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
                const event = yield (0, calender_1.setCalenderEvent)(paylaod, userDetails, customerEmail);
                if (!event) {
                    return false;
                }
                let booking;
                console.log('creating booking');
                if (!bookingId) {
                    booking = yield bookingDetails_1.default.create({
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
                }
                else {
                    booking = yield bookingDetails_1.default.update({
                        sellerId,
                        serviceId,
                        bookingDate: new Date(slot),
                        iCalUID: event.iCalUID,
                        eventId: event.id,
                        meetingLink: event.hangoutLink,
                        status: 'booked'
                    }, {
                        where: {
                            id: bookingId
                        }
                    });
                }
                const templateData = {
                    meetProLink: 'https://meetpro.club',
                    date: moment(slot).format('Do MMMM YYYY, dddd'),
                    time: moment(startTime).utcOffset(330).format('hh:mm A') +
                        '-' +
                        moment(endTime).utcOffset(330).format('hh:mm A') +
                        ' (IST)',
                    mentorName: user.name,
                    offeringName: serviceTitle,
                    menteeName: customerName,
                    userDetails: `${process.env.FE_INSTA_LEARN_DOMAIN}/calls?bookingId=` +
                        (bookingId || booking.id),
                    meetingLink: event.hangoutLink
                };
                (0, emailer_1.default)([user.email], process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS, parseInt(process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS_TEMPLATE), templateData);
                (0, emailer_1.default)([customerEmail], 'Booking Confirmed!', parseInt(process.env.COMM_ACCESS_EMAIL_BOOKING_SUCCESS_TEMPLATE), Object.assign(Object.assign({}, templateData), { userDetails: '' }));
                user.mobile &&
                    freshchat_service_1.default.sendBookingConfirmationFreshchatServiceRequest(user.name, customerName, serviceTitle, moment(slot).format('LLLL') + ' (IST)', event.hangoutLink, user.mobile);
                const encodedLink = yield this.createQueryFromBookingId(bookingId || booking.id);
                (0, emailer_1.default)([customerEmail], 'local test template', 38, {
                    meetProLink: 'testMeetProLink',
                    date: 'testDate',
                    time: 'testTime',
                    mentorName: 'testMentor',
                    offeringName: 'testOffering',
                    feedbackLink: `${process.env.FE_INSTA_LEARN_DOMAIN}feedback?testimonialId=` +
                        encodedLink
                });
                return { bookingId: booking.id };
            }
            catch (err) {
                console.debug(err);
                return false;
            }
        });
    }
    deleteUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (process.env.ENVIRONMENT == 'production') {
                    return {
                        statusCode: 403,
                        message: 'This is Production, Please Stay away!!!!👮🏾‍♀️🚨',
                        data: { deleted: false }
                    };
                }
                console.log(email);
                const user = yield user_1.default.findOne({
                    where: {
                        email
                    }
                });
                if (!user) {
                    throw new Error('user not found');
                }
                const { id: userId } = user;
                yield bankDetails_1.default.destroy({
                    where: {
                        userId
                    }
                });
                yield payment_1.default.destroy({
                    where: {
                        sellerId: userId
                    }
                });
                yield bookingDetails_1.default.destroy({
                    where: {
                        sellerId: userId
                    }
                });
                yield serviceDetails_1.default.destroy({
                    where: {
                        userId
                    }
                });
                yield availability_1.default.destroy({
                    where: {
                        userId
                    }
                });
                yield user_1.default.destroy({
                    where: {
                        id: userId
                    }
                });
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: { deleted: true }
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    addBankDetails(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { beneficiaryName, accountNumber, IFSC, email } = data;
                console.log(beneficiaryName, accountNumber, IFSC, email, userId);
                const [token, user] = yield Promise.all([
                    (0, generate_signature_1.default)(),
                    user_1.default.findOne({
                        where: {
                            id: userId
                        },
                        raw: true
                    })
                ]);
                console.log(token);
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
                let bankData = yield axios.post(`${process.env.PMS_SERVIE}v1/payment/user`, payload, headers);
                console.log(bankData === null || bankData === void 0 ? void 0 : bankData.data);
                if (bankData &&
                    bankData.data &&
                    bankData.data.data.gatewayAccountId) {
                    const [userAccount] = yield bankDetails_1.default.findOrCreate({
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
                    return new ResponseBuilder(200, { userAccount }, errorMessages_1.SUCCESS_200);
                }
            }
            catch (error) {
                console.log(error.response);
                if (error.response.data &&
                    error.response.data.status == 'failure') {
                    return new ResponseBuilder(400, Object.assign({}, error.response.data.data), 'This email id is already mapped.Please try with another email id');
                }
                throw new Error(error);
            }
        });
    }
    uploadImage(fileExtension, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const extension = this.extensionMapping(fileExtension);
                const BucketName = process.env.INSTALEARN_BUCKET;
                console.log(extension, BucketName);
                const destFileName = 'user' + new Date().getTime() + '-' + userId + extension;
                console.log('BucketName', BucketName, destFileName);
                const url = yield (0, bucket_upload_1.getSignedUrl)(destFileName, BucketName, fileExtension);
                console.log(url);
                return new ResponseBuilder(200, url, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    getBankDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankDetails = yield bankDetails_1.default.findOne({
                    where: {
                        userId: userId
                    }
                });
                return new ResponseBuilder(200, bankDetails || {}, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    sendCreatorMarketingMessages(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const segment1Users = yield sequelize_2.sequelize.query({
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
                const segment2Users = yield sequelize_2.sequelize.query({
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
                yield Promise.allSettled(segment1Users[0].map((data) => this.processEmailToSendMessages(Object.assign(Object.assign({}, data), { segment: 1 }), response)));
                yield Promise.allSettled(segment2Users[0].map((data) => this.processEmailToSendMessages(Object.assign(Object.assign({}, data), { segment: 2 }), response)));
                return new ResponseBuilder(200, response || [], errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    processEmailToSendMessages(data, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, segment, mobile, id } = data;
                if (segment === 1) {
                    console.log('segment1');
                    yield freshchat_service_1.default.sendSegment1FreshchatServiceRequest(name, mobile);
                    yield creatorMarketing_1.default.create({
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
                    freshchat_service_1.default.sendSegment2FreshchatServiceRequest(name, mobile);
                    yield creatorMarketing_1.default.create({
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
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    bookingQuestions(creatorId, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield bookingQuestions_1.default.findAll({
                    where: {
                        sellerId: Number(creatorId),
                        isDeleted: false,
                        serviceId: Number(serviceId)
                    },
                    attributes: ['id', 'question']
                });
                const linkedin = {
                    id: 0,
                    question: 'Your LinkedIn URL?'
                };
                questions.unshift(linkedin);
                return questions;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getBookingBlockedSlots(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [userRules, availabilityModifications] = yield Promise.all([
                    this.getUserRulesById(userId, {
                        isActive: 1
                    }),
                    this.getUserModificationsAvailability(userId)
                ]);
                if (!userRules.length) {
                    return {
                        statusCode: 200,
                        message: errorMessages_1.SUCCESS_200,
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
                        const checkAlteredDate = availabilityModifications.find((x) => String(x.date) == currentDate);
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
                return new ResponseBuilder(200, result || [], errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map