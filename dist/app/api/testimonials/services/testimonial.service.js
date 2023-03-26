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
const common_service_1 = require("../../../utils/common.service");
const { ResponseBuilder } = require('base-packages');
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const testimonials_1 = require("../../../../models/testimonials");
const bookingDetails_1 = require("../../../../models/bookingDetails");
const customer_1 = require("../../../../models/customer");
const serviceDetails_1 = require("../../../../models/serviceDetails");
const payment_1 = require("../../../../models/payment");
const user_1 = require("../../../../models/user");
const freshchat_service_1 = require("../../../../app/utils/freshchat/freshchat.service");
class TestimonialService extends common_service_1.default {
    getTestimonialData(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.getBookingIdFromQuery(bookingId);
                const testimonial = yield testimonials_1.default.findOne({
                    where: {
                        bookingId: id
                    }
                });
                if (testimonial) {
                    return new ResponseBuilder(200, {
                        alreadyfilled: true
                    }, errorMessages_1.SUCCESS_200);
                }
                const booking = yield bookingDetails_1.default.findOne({
                    where: {
                        id: id
                    },
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
                            attributes: ['id']
                        }
                    ],
                    attributes: [
                        'id',
                        'bookingDate',
                        'from',
                        'to',
                        'createdAt',
                        'sellerId'
                    ]
                });
                const seller = yield user_1.default.findOne({
                    where: {
                        id: booking.sellerId
                    },
                    attributes: ['name', 'imageUrl', 'googleUrl', 'socialLinks']
                });
                console.log(id);
                return new ResponseBuilder(200, {
                    booking,
                    seller,
                    alreadyfilled: false
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getTestimonialDetails(id, enc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const testimonialId = enc
                    ? yield this.getBookingIdFromQuery(id)
                    : id;
                const testimonial = yield testimonials_1.default.findByPk(testimonialId);
                if (!testimonial) {
                    return new ResponseBuilder(404, {}, errorMessages_1.DATA_NOT_FOUND);
                }
                const booking = yield bookingDetails_1.default.findOne({
                    where: {
                        id: testimonial.bookingId
                    },
                    include: [
                        {
                            model: serviceDetails_1.default,
                            attributes: ['title']
                        },
                        {
                            model: payment_1.default,
                            include: [
                                {
                                    model: customer_1.default,
                                    attributes: ['name']
                                }
                            ],
                            attributes: ['id']
                        }
                    ],
                    attributes: ['id']
                });
                if (!booking) {
                    return new ResponseBuilder(404, {}, errorMessages_1.DATA_NOT_FOUND);
                }
                return new ResponseBuilder(200, {
                    rating: testimonial.rating,
                    isPublished: testimonial.isPublished,
                    customerName: booking.payment.customer.name,
                    serviceTitle: booking.service.title,
                    testimonial: testimonial.testimonial,
                    testimonialId: testimonial.id
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    createTestimonialData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, sellerId, rating, testimonial, customerId } = data;
                const [seller, booking] = yield Promise.all([
                    user_1.default.findOne({
                        where: {
                            id: sellerId
                        },
                        attributes: ['rating', 'numRatings', 'mobile', 'name'],
                        raw: true
                    }),
                    bookingDetails_1.default.findOne({
                        where: {
                            id: bookingId
                        },
                        attributes: ['serviceId'],
                        include: [
                            {
                                model: payment_1.default,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: customer_1.default
                                    }
                                ]
                            }
                        ]
                    })
                ]);
                const newRating = Number(((seller.rating * seller.numRatings + rating) /
                    (seller.numRatings + 1)).toFixed(1));
                const [response] = yield Promise.all([
                    testimonials_1.default.create({
                        bookingId: bookingId,
                        sellerId: sellerId,
                        rating: rating,
                        testimonial: testimonial,
                        customerId: customerId,
                        serviceId: booking.serviceId
                    }),
                    user_1.default.update({
                        rating: newRating,
                        numRatings: seller.numRatings + 1
                    }, {
                        where: {
                            id: sellerId
                        }
                    })
                ]);
                const encodedLink = yield this.createQueryFromBookingId(response.id);
                seller.mobile &&
                    freshchat_service_1.default.sendFeedBackSubmittedFreshchatServiceRequest(seller.name, booking.payment.customer.name, process.env.FE_INSTA_LEARN_DOMAIN +
                        'calls?testimonialId=' +
                        encodedLink, seller.mobile);
                return new ResponseBuilder(200, {
                    response
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    publishTestimonialData(publishFlag, testimonialId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const testimonial = yield testimonials_1.default.update({
                    isPublished: publishFlag
                }, {
                    where: {
                        id: testimonialId
                    }
                });
                return new ResponseBuilder(200, {
                    testimonial
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new TestimonialService();
//# sourceMappingURL=testimonial.service.js.map