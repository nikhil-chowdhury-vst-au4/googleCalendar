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
const offerings_service_1 = require("../services/offerings.service");
class EditService extends MasterController {
    static doc() {
        return {
            tags: ['Offerings'],
            description: 'Edit existing services',
            summary: 'Edit existing services'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({
            id: Joi.number().required()
        }));
        payload.addToBody(Joi.object().keys({
            title: Joi.string().optional(),
            description: Joi.string().optional(),
            price: Joi.number().optional(),
            duration: Joi.number().optional(),
            questions: Joi.array().optional()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield offerings_service_1.default.editService(this.data, this.req.user.id);
            }
            catch (error) {
                console.log('error ::: ', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = EditService;
//# sourceMappingURL=edit.service.js.map