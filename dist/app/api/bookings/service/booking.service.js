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
exports.BOOKING_TYPE = void 0;
const sequelize_1 = require("sequelize");
const common_service_1 = require("../../../../app/utils/common.service");
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const bookingDetails_1 = require("../../../../models/bookingDetails");
const customer_1 = require("../../../../models/customer");
const serviceDetails_1 = require("../../../../models/serviceDetails");
const moment = require("moment");
const payment_1 = require("../../../../models/payment");
const user_1 = require("../../../../models/user");
const freshchat_service_1 = require("../../../../app/utils/freshchat/freshchat.service");
const testimonials_1 = require("../../../../models/testimonials");
const emailer_1 = require("../../../../app/utils/emailer");
var BOOKING_TYPE;
(function (BOOKING_TYPE) {
    BOOKING_TYPE["upcoming"] = "upcoming";
    BOOKING_TYPE["completed"] = "completed";
    BOOKING_TYPE["today"] = "today";
})(BOOKING_TYPE = exports.BOOKING_TYPE || (exports.BOOKING_TYPE = {}));
var BOOKING_STATUS;
(function (BOOKING_STATUS) {
    BOOKING_STATUS["booked"] = "booked";
    BOOKING_STATUS["pending"] = "pending";
    BOOKING_STATUS["cancelled"] = "cancelled";
    BOOKING_STATUS["failed"] = "failed";
})(BOOKING_STATUS || (BOOKING_STATUS = {}));
var TESTIMONIAL_STATUS;
(function (TESTIMONIAL_STATUS) {
    TESTIMONIAL_STATUS["pending"] = "pending";
    TESTIMONIAL_STATUS["sent"] = "sent";
})(TESTIMONIAL_STATUS || (TESTIMONIAL_STATUS = {}));
class BookingService extends common_service_1.default {
    getBookingsByQuery(type, userId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filterMap = {
                    upcoming: {
                        to: {
                            [sequelize_1.Op.gt]: new Date()
                        }
                    },
                    completed: {
                        to: {
                            [sequelize_1.Op.lte]: new Date()
                        }
                    },
                    today: {
                        to: {
                            [sequelize_1.Op.lte]: moment().utc().endOf('day'),
                            [sequelize_1.Op.gte]: moment().utc()
                        }
                    }
                };
                const formatWhere = filterMap[type];
                const orderBy = type == BOOKING_TYPE.upcoming || type == BOOKING_TYPE.today
                    ? 'ASC'
                    : 'DESC';
                const bookings = yield bookingDetails_1.default.findAll({
                    where: Object.assign({ sellerId: userId, status: BOOKING_STATUS.booked }, formatWhere),
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['id', 'duration', 'title', 'price']
                        },
                        {
                            model: payment_1.default,
                            include: [
                                {
                                    model: customer_1.default
                                }
                            ],
                            attributes: ['id', 'amount']
                        },
                        {
                            model: testimonials_1.default
                        }
                    ],
                    limit: Number(limit) || 5,
                    offset: Number(page) || 0,
                    order: [['to', orderBy]]
                });
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: bookings
                };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getBookingsCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingDetails_1.default.findAll({
                    where: {
                        sellerId: userId,
                        status: BOOKING_STATUS.booked
                    },
                    attributes: [
                        [
                            sequelize_1.Sequelize.literal('SUM(CASE WHEN `to`> now() THEN 1 ELSE 0 END)'),
                            BOOKING_TYPE.upcoming
                        ],
                        [
                            sequelize_1.Sequelize.literal('SUM(CASE WHEN `to`<= now() THEN 1 ELSE 0 END)'),
                            BOOKING_TYPE.completed
                        ]
                    ],
                    raw: false
                });
                const result = {
                    upcoming: bookings[0]['dataValues'][BOOKING_TYPE.upcoming] || 0,
                    completed: bookings[0]['dataValues'][BOOKING_TYPE.completed] || 0
                };
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: result
                };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getBookingById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingDetails_1.default.findByPk(bookingId, {
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['id', 'duration', 'title', 'price']
                        },
                        {
                            model: payment_1.default,
                            include: [
                                {
                                    model: customer_1.default
                                }
                            ],
                            attributes: ['id', 'amount']
                        }
                    ]
                });
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: booking
                };
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    sendReminderWAForBookings() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let checkTime = moment().add(15, 'minutes').startOf('minute');
                checkTime = checkTime.set({ seconds: 0 });
                const bookings = yield bookingDetails_1.default.findAll({
                    where: {
                        status: BOOKING_STATUS.booked,
                        from: checkTime
                    },
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['id', 'duration', 'title', 'price'],
                            include: [
                                {
                                    model: user_1.default,
                                    attributes: ['name', 'mobile']
                                }
                            ]
                        },
                        {
                            model: payment_1.default,
                            include: [
                                {
                                    model: customer_1.default
                                }
                            ],
                            attributes: ['id', 'amount']
                        }
                    ],
                    order: [['createdAt', 'ASC']]
                });
                console.log(bookings);
                for (let item of bookings) {
                    if ((_b = (_a = item === null || item === void 0 ? void 0 : item.service) === null || _a === void 0 ? void 0 : _a.creator) === null || _b === void 0 ? void 0 : _b.mobile) {
                        const payload = {
                            name: item.service.creator.name,
                            customerName: item.payment.customer.name,
                            serviceTitle: item.service.title,
                            slot: moment(item.from)
                                .utcOffset(330)
                                .format('hh:mm A'),
                            meetingLink: item.meetingLink,
                            mobile: item.service.creator.mobile
                        };
                        freshchat_service_1.default.sendBookingReminderFreshchatServiceRequest(payload.name, payload.customerName, payload.serviceTitle, payload.slot, payload.meetingLink, payload.mobile);
                        freshchat_service_1.default.sendBookingReminderFreshchatServiceRequest(payload.customerName, payload.name, payload.serviceTitle, payload.slot, payload.meetingLink, item.payment.customer.mobile);
                    }
                }
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getBookingsForTestimonial() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentTime = new Date();
            const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
            try {
                const bookings = yield bookingDetails_1.default.findAll({
                    where: {
                        status: BOOKING_STATUS.booked,
                        testimonialTrigger: TESTIMONIAL_STATUS.pending,
                        to: {
                            [sequelize_1.Op.lte]: fiveMinutesAgo
                        },
                        bookingDate: {
                            [sequelize_1.Op.gt]: moment('2023-03-15').toDate()
                        }
                    },
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['id', 'duration', 'title', 'price'],
                            include: [{ model: user_1.default }]
                        },
                        {
                            model: payment_1.default,
                            include: [
                                {
                                    model: customer_1.default
                                }
                            ],
                            attributes: ['id', 'amount']
                        }
                    ],
                    limit: 20,
                    order: [['to', 'ASC']],
                    raw: false
                });
                console.table(bookings);
                for (let item of bookings) {
                    if ((_a = item === null || item === void 0 ? void 0 : item.payment) === null || _a === void 0 ? void 0 : _a.customer) {
                        const encodedLink = yield this.createQueryFromBookingId(item.id);
                        (0, emailer_1.default)([item.payment.customer.email], 'Share your session experience', 38, {
                            meetProLink: 'http://meetpro.club',
                            date: moment(item.bookingDate).format('Do MMMM YYYY, dddd'),
                            time: moment(item.from)
                                .utcOffset(330)
                                .format('hh:mm A') +
                                '-' +
                                moment(item.to)
                                    .utcOffset(330)
                                    .format('hh:mm A') +
                                ' (IST)',
                            mentorName: item.service.creator.name,
                            offeringName: item.service.title,
                            feedbackLink: process.env.FE_INSTA_LEARN_DOMAIN +
                                '/feedback?testimonialId=' +
                                encodedLink
                        });
                        freshchat_service_1.default.sendFeedBackLinkFreshchatServiceRequest(item.service.creator.name, item.payment.customer.name, process.env.FE_INSTA_LEARN_DOMAIN +
                            '/feedback?testimonialId=' +
                            encodedLink, item.payment.customer.mobile);
                        yield bookingDetails_1.default.update({
                            testimonialTrigger: TESTIMONIAL_STATUS.sent
                        }, {
                            where: {
                                id: item.id
                            }
                        });
                    }
                }
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
}
exports.default = new BookingService();
//# sourceMappingURL=booking.service.js.map