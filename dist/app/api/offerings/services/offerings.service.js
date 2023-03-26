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
const bookingQuestions_1 = require("../../../../models/bookingQuestions");
class OfferingsService extends common_service_1.default {
    getAllOfferings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId);
                const services = yield serviceDetails_1.default.findAll({
                    where: {
                        userId: userId,
                        isActive: true
                    },
                    raw: true
                });
                const linkedin = {
                    id: 0,
                    question: 'Your LinkedIn URL?'
                };
                const servicesWithQuestions = yield Promise.all(services.map((service) => __awaiter(this, void 0, void 0, function* () {
                    const bookingQuestions = yield bookingQuestions_1.default.findAll({
                        where: {
                            isDeleted: false,
                            sellerId: userId,
                            serviceId: service.id
                        },
                        attributes: ['id', 'question'],
                        raw: true
                    });
                    console.log(bookingQuestions);
                    bookingQuestions.unshift(linkedin);
                    return Object.assign(Object.assign({}, service), { questions: bookingQuestions });
                })));
                console.log(servicesWithQuestions);
                return new ResponseBuilder(200, servicesWithQuestions, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    addSevice(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield serviceDetails_1.default.create({
                    userId: userId,
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    isFree: !(data.price > 0),
                    serviceType: 'usergenerated',
                    duration: data.duration
                });
                if (data.questions && data.questions.length) {
                    yield Promise.all(data.questions.map((res) => bookingQuestions_1.default.create({
                        question: res.question,
                        serviceId: service.id,
                        sellerId: userId
                    })));
                }
                return new ResponseBuilder(200, {
                    service
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    editService(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield serviceDetails_1.default.findOne({
                    where: {
                        id: Number(data.id),
                        userId: userId
                    }
                });
                if (!service) {
                    return new ResponseBuilder(200, {}, 'Service not found');
                }
                const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (data.title && { title: data.title })), (data.description && { description: data.description })), ((data.price || data.price === 0) && { price: data.price })), ((data.price || data.price === 0) && {
                    isFree: !(data.price > 0)
                })), (data.duration && { duration: data.duration }));
                const updatedService = yield serviceDetails_1.default.update(updateData, {
                    where: {
                        id: Number(data.id)
                    }
                });
                if (data.questions && data.questions.length) {
                    yield Promise.allSettled(data.questions.map((question) => {
                        if (!question.id) {
                            return bookingQuestions_1.default.create({
                                question: question.question,
                                sellerId: userId,
                                serviceId: data.id
                            }, {
                                logging: true
                            });
                        }
                        if (question.id && question.isUpdated) {
                            return bookingQuestions_1.default.update({
                                question: question.question
                            }, {
                                where: { id: question.id },
                                logging: true
                            });
                        }
                        if (question.id && question.isDeleted) {
                            return bookingQuestions_1.default.update({
                                isDeleted: true
                            }, {
                                where: {
                                    id: question.id
                                },
                                logging: true
                            });
                        }
                        return Promise.resolve();
                    }));
                }
                return new ResponseBuilder(200, {
                    updatedService
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteService(offeringId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const service = yield serviceDetails_1.default.update({
                    isActive: false
                }, {
                    where: {
                        id: offeringId,
                        userId: userId
                    }
                });
                yield bookingQuestions_1.default.destroy({
                    where: {
                        serviceId: offeringId,
                        sellerId: userId
                    }
                });
                return new ResponseBuilder(200, {
                    service
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new OfferingsService();
//# sourceMappingURL=offerings.service.js.map