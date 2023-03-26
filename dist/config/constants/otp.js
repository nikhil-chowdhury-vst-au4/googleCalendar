"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class OTP extends common_1.default {
    static get EMAIL_OR_MOBILE_REQUIRED() {
        return errorMessages_1.EITHER_MOBILE_EMAIL_REQUIRED;
    }
    static get COUNTRY_EXT_REQUIRED() {
        return errorMessages_1.COUNTRY_EXT_MOBILE_REQ;
    }
    static get MAX_ATTEMPTS_REACHED() {
        return errorMessages_1.MAX_ATTEMPTS_REACHED;
    }
    static get INVALID_OTP() {
        return errorMessages_1.INVALID_OTP;
    }
    static get SUCCESS_VERIFY() {
        return errorMessages_1.VERIFY_SUCCESSFUL;
    }
    static get SEND() {
        return errorMessages_1.OTP_CODE_SENT;
    }
    static get TEMP() {
        return errorMessages_1.YOUR_ONE_TIME_PASSWORD;
    }
    static get VIA_SMS_OR_VIA_EMAIL_REQUIRED() {
        return errorMessages_1.VIASMS_OR_VIAEMAIL;
    }
    static get RETRY_VOICE_VIA_EMAIL() {
        return errorMessages_1.RETRY_VOICE_NOT_POSSIBLE;
    }
    static get INVALID_MOB_NUMBER() {
        return errorMessages_1.INVALID_MOB_NUMBER;
    }
    static get NO_UNUSED_OTP_FOUND() {
        return errorMessages_1.NO_UNUSED_OTP;
    }
    static get OTP_IS_MISSING() {
        return errorMessages_1.OTP_IS_MISSING;
    }
    static get EMAIL_IS_REQUIRED() {
        return errorMessages_1.EMAIL_IS_REQUIRED;
    }
}
exports.default = OTP;
//# sourceMappingURL=otp.js.map