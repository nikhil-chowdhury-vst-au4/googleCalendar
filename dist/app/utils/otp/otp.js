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
const axios = require('axios');
const crypto = require('crypto');
const jsonwebtoken_1 = require("jsonwebtoken");
class OTP {
    generateOTP() {
        const ran = Math.random() * 9000;
        return Math.floor(1000 + ran);
    }
    generateOTPHash(otp, mobile, email) {
        return crypto
            .createHash('md5')
            .update(`${otp}${mobile || email}`)
            .digest('hex');
    }
    validateOTP(otp, hash, mobile, email) {
        return (hash ==
            crypto
                .createHash('md5')
                .update(`${otp}${mobile || email}`)
                .digest('hex'));
    }
    sendSmsOTP(mobile, otp, expireAT, senderId, countryCode = '91') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (parseInt(process.env.IS_CE_OTP_ACTIVE) == 1) {
                    const cePayload = {
                        templateData: { otp: otp, hash: '' },
                        sms: {
                            mobileNumbers: [mobile],
                            countryCode: countryCode,
                            smsType: 3,
                            metaData: {},
                            smsTemplateCode: 'FC_OTP'
                        },
                        priority: 'P0'
                    };
                    const payload = {
                        clientId: process.env.COMM_SERVICE_CLIENT_ID,
                        clientSecret: process.env.COMM_SERVICE_CLIENT_SECRET
                    };
                    const token = (0, jsonwebtoken_1.sign)(payload, process.env.COMM_TOKEN_SECRET, {
                        expiresIn: process.env.COMM_TOKEN_EXPIRY_DURATION,
                        algorithm: process.env.COMM_ACCESS_TOKEN_ALGO
                    });
                    console.log('CE PAYLOD :: ', cePayload);
                    const ceUrl = `${process.env.COMMUNICATION_SERVICE}/v2/Communications/sms/internal `;
                    let res = yield axios.post(ceUrl, cePayload, {
                        headers: {
                            'access-token': token
                        }
                    });
                    if (res.status > 299 || res.status < 200) {
                        throw new Error('Failed to send OTP');
                    }
                }
                else {
                    const payload = {
                        senderId: senderId,
                        mobile: mobile,
                        otp: otp,
                        otp_expiry: expireAT,
                        countryExt: '91'
                    };
                    let data = yield axios.post(`${process.env.NOTIFICATION_SERVICE}/v1/notifications/sms/otp`, payload);
                    if (data.status > 299 || data.status < 200) {
                        throw new Error('Failed to send OTP');
                    }
                }
            }
            catch (e) {
                console.log('[OTP]:[sendSmsOTP]', e);
                throw new Error('Failed to send OTP');
            }
        });
    }
}
exports.default = new OTP();
//# sourceMappingURL=otp.js.map