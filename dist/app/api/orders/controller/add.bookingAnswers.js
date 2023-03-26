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
const { MasterController, RequestBuilder, Joi } = require('base-packages');
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const order_service_1 = require("../services/order.service");
class AddBookingAnswers extends MasterController {
    static doc() {
        return {
            tags: ['Order'],
            description: 'Add answers to booking questions',
            summary: 'Add answers to booking questions'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        const answers = Joi.object().keys({
            id: Joi.number().required(),
            answer: Joi.string().optional().allow('', null).default(null),
            question: Joi.string().required()
        });
        payload.addToBody(Joi.object().keys({
            answers: Joi.array().items(answers).required(),
            bookingId: Joi.number().required()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const answers = yield order_service_1.default.addBookingAnswers(this.data);
                return new this.ResponseBuilder(200, answers, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                console.log('error ::: ', error);
                return new this.ResponseBuilder(400, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = AddBookingAnswers;
//# sourceMappingURL=add.bookingAnswers.js.map