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
const user_service_1 = require("../services/user.service");
class EditUserAvailabilityDates extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Modify Availability Dates',
            summary: 'Modify Availability Dates ex: block or override time'
        };
    }
    static validate() {
        const rules = Joi.object().keys({
            from: Joi.string().required(),
            to: Joi.string().required()
        });
        const payload = new RequestBuilder();
        payload.addToBody(Joi.object().keys({
            date: Joi.string().required(),
            isActive: Joi.boolean().default(1),
            rules: Joi.array().items(rules).required()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield user_service_1.default.editAvailibilityDatesOfUser(this.data, this.req.user);
                return new this.ResponseBuilder(result.statusCode, {}, result.message);
            }
            catch (error) {
                console.log('error ::: ', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = EditUserAvailabilityDates;
//# sourceMappingURL=modify.availabilityDates.js.map