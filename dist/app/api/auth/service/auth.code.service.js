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
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../../../../models/user");
const token_1 = require("../../../utils/gcloud/token");
const user_service_1 = require("../../user/services/user.service");
class AuthService extends common_service_1.default {
    register(code, redirect_uri, source, campaign, medium, signupPoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('source', source, campaign, medium);
                const tokenData = yield (0, token_1.generateTokenViaClient)(code, redirect_uri);
                if (!tokenData) {
                    return {
                        statusCode: 400,
                        message: 'wrong code provided',
                        data: {}
                    };
                }
                const getGoogleProfile = yield (0, token_1.getGoogleProfileData)(tokenData.access_token);
                if (!getGoogleProfile) {
                    return {
                        statusCode: 400,
                        message: errorMessages_1.BAD_CLIENT_REQUEST_400,
                        data: {}
                    };
                }
                console.log(tokenData);
                const user = yield user_1.default.findOne({
                    where: {
                        email: getGoogleProfile.email
                    }
                });
                const availability = user
                    ? yield user_service_1.default.getUserRuleById(user.id)
                    : null;
                const userCreateData = Object.assign(Object.assign(Object.assign(Object.assign({ name: getGoogleProfile.name, email: getGoogleProfile.email, googleUrl: getGoogleProfile.picture, refreshToken: tokenData.refresh_token }, (source && { source: source })), (campaign && { campaign: campaign })), (medium && { medium: medium })), (signupPoint && { signupPoint: signupPoint }));
                console.log('userCreateData :; ', userCreateData);
                const userData = user || (yield user_1.default.create(userCreateData));
                const payload = {
                    id: userData.id,
                    email: userData.email
                };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.TOKEN_SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                    algorithm: process.env.ACCESS_TOKEN_ALGO
                });
                return {
                    statusCode: 200,
                    message: errorMessages_1.SUCCESS_200,
                    data: {
                        token,
                        exists: user ? 1 : 0,
                        onboardingStatus: Boolean(availability)
                    }
                };
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.code.service.js.map