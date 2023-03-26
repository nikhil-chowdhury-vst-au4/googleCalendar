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
const { MasterController, RequestBuilder } = require('base-packages');
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const user_service_1 = require("../services/user.service");
class GetExpertiseAndServices extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get Expertise and default services',
            summary: 'Get Expertise and default services'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_service_1.default.getExpertiseAndServices();
            }
            catch (error) {
                console.log('Get Expertise and default services', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = GetExpertiseAndServices;
//# sourceMappingURL=get.expertise.js.map