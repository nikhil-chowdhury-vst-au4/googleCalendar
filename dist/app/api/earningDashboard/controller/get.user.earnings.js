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
const earning_dashboard_1 = require("../services/earning.dashboard");
class GetUserEarnings extends MasterController {
    static doc() {
        return {
            tags: ['Earnings'],
            description: 'Get user Earning dashboard details',
            summary: 'Get user Earning dashboard details'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(Joi.object().keys({
            startDate: Joi.string().optional(),
            endDate: Joi.string().optional()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield earning_dashboard_1.default.getEarningDashboardDetails(this.req.user.id, this.data);
            }
            catch (error) {
                console.log('error ::: ', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = GetUserEarnings;
//# sourceMappingURL=get.user.earnings.js.map