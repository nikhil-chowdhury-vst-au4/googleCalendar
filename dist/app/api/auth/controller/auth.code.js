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
const auth_code_service_1 = require("../service/auth.code.service");
class GetOtp extends MasterController {
    static doc() {
        return {
            tags: ['Auth'],
            description: 'Get Code',
            summary: 'Get Code'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(Joi.object().keys({
            code: Joi.string().required(),
            redirect_uri: Joi.string().required(),
            campaign: Joi.string().optional().allow('').default(null),
            source: Joi.string().optional().allow('').default(null),
            medium: Joi.string().optional().allow('').default(null),
            signupPoint: Joi.string().optional().allow('').default(null)
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, redirect_uri, campaign, source, medium, signupPoint } = this.data;
                const result = yield auth_code_service_1.default.register(code, redirect_uri, source, campaign, medium, signupPoint);
                return new this.ResponseBuilder(result.statusCode, result.data, result.message);
            }
            catch (error) {
                console.log('error ::: ', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = GetOtp;
//# sourceMappingURL=auth.code.js.map