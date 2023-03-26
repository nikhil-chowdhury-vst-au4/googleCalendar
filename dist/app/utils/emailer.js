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
const jsonwebtoken_1 = require("jsonwebtoken");
const axios = require('axios');
function sendEmail(email, subject, templateId, templateData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accessToken = yield generateMailToken();
            const payload = {
                orgId: parseInt(process.env.COMM_ACCESS_SMS_ORG_ID),
                senderId: parseInt(process.env.COMM_ACCESS_EMAIL_SENDER_ID),
                service: 1,
                email: {
                    subject: subject,
                    to: email,
                    from: process.env.ENVIRONMENT == 'production'
                        ? 'scheduling@meetpro.club'
                        : 'info@fankonnect.com'
                },
                templateId: templateId,
                templateData: templateData,
                priority: 'P2'
            };
            const headers = {
                headers: {
                    'access-token': accessToken,
                    'Content-Type': 'application/json'
                }
            };
            let data = yield axios.post(`${process.env.COMMUNICATION_SERVICE}/v2/addCommunication/email/internal`, payload, headers);
            console.log(data);
            return data;
        }
        catch (e) {
            console.log('[OTP]:[sendEmailOTP]', e);
        }
    });
}
exports.default = sendEmail;
function generateMailToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            clientId: process.env.COMM_SERVICE_CLIENT_ID,
            clientSecret: process.env.COMM_SERVICE_CLIENT_SECRET
        };
        const token = yield (0, jsonwebtoken_1.sign)(payload, process.env.COMM_TOKEN_SECRET, {
            expiresIn: process.env.COMM_TOKEN_EXPIRY_DURATION,
            algorithm: process.env.COMM_ACCESS_TOKEN_ALGO
        });
        return token;
    });
}
//# sourceMappingURL=emailer.js.map