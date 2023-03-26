"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class User extends common_1.default {
    static get USER_NOT_FOUND_ABORTING() {
        return errorMessages_1.USER_NOT_FOUND_ABORT;
    }
    static get ONLY_STUDENT_CAN_BE_REMOVED_FROM_ORG() {
        return errorMessages_1.ONLY_STUDENT_CAN_BE_REMOVED_FROM_ORG;
    }
    static get USER_REMOVED_FROM_ORG_SUCCESS() {
        return errorMessages_1.USER_REMOVED_FROM_ORG;
    }
    static get USER_NOT_FOUND() {
        return errorMessages_1.USER_NOT_FOUND;
    }
    static get SESSION_CREATED() {
        return errorMessages_1.SESSION_CREATED;
    }
    static get SESSION_UPDATED() {
        return errorMessages_1.SESSION_UPDATED;
    }
    static get STUDENT_SUBSCRIBED_CAN_NOT_BE_DELETED() {
        return errorMessages_1.STUDENTS_SUBSCRIBED_CANNOT_DELETED;
    }
    static get DELETED_SUCCESSFULLY() {
        return errorMessages_1.DELETED_SUCCESSFULLY;
    }
    static get INVALID_FILTER() {
        return errorMessages_1.INVALID_USER_FILTER;
    }
    static get ALREADY_ADDED() {
        return errorMessages_1.USER_COORDINATE_ALREADY_ADDED;
    }
    static get NO_INFO_FOUND() {
        return errorMessages_1.NO_CITY_STATE_INFO;
    }
    static get DATA_UPDATED() {
        return errorMessages_1.USER_COORD_UPDATED;
    }
    static get NOT_UPDATED() {
        return errorMessages_1.COORD_DETAILS_UPDATES;
    }
    static get TUTOR_NOT_AVAILABLE() {
        return errorMessages_1.TUTOR_NOT_AVAILABLE;
    }
    static get STUDENT_NOT_AVAILABLE() {
        return errorMessages_1.STUDENT_NOT_AVAILABLE;
    }
    static get INVALID_TYPE() {
        return errorMessages_1.INVALID_TYPE_TOKEN;
    }
    static get SUCCESS_ADDED() {
        return errorMessages_1.SUCCESSFULLY_ADDED;
    }
    static get UNABLE_TO_RECOGNIZE() {
        return errorMessages_1.UNABLE_TO_RECOGNIZE_USER;
    }
    static get ACTION_NOT_ALLOWED() {
        return errorMessages_1.YOU_ARE_NOT_ALLOWED;
    }
    static get INVALID_USER() {
        return errorMessages_1.INVALID_USER;
    }
    static get PARENT_LOGIN_OFF() {
        return errorMessages_1.PARENT_LOGIN_NOT_ENABLED;
    }
    static get INVALID_OTP_SESSION() {
        return errorMessages_1.INVALID_OTP_SESSIONID;
    }
    static get INVALID_USER_TYPE() {
        return errorMessages_1.INVALID_TYPE_USER;
    }
    static get USER_ALREADY_EXISTS() {
        return errorMessages_1.USER_ALREADY_EXISTS;
    }
    static get NOT_ALLOWED_FOR_TUTORS() {
        return errorMessages_1.NOT_ALLOWED_FOR_TUTORS;
    }
    static get DATA_FETCHED_SUCCESSFULLY() {
        return errorMessages_1.DATA_FETCHED_SUCCESSFULLY;
    }
    static get USER_DETAILS_FETCHED_SUCCESSFULLY() {
        return errorMessages_1.USER_DETAILS_FETCHED_SUCCESSFULLY;
    }
    static get UNRECOGNIZED_TYPE() {
        return errorMessages_1.UNRECOGNIZED_TYPE;
    }
    static get UPDATE_ERROR() {
        return errorMessages_1.UPDATE_ERROR;
    }
    static get APPLIED_PROMOCODE() {
        return errorMessages_1.SUCCESSFULLY_APPLIED_PROMOCODE;
    }
    static get FEILDS_MISSING() {
        return errorMessages_1.FEILDS_MISSING;
    }
    static get UNABLE_VERIFY_TRUE_CALLER() {
        return errorMessages_1.UNABLE_VERIFY_TRUE_CALLER;
    }
    static get TRUE_CALLER_PROFILE_MISSING() {
        return errorMessages_1.TRUE_CALLER_PROFILE_MISSING;
    }
    static get REGISTERED_AS_TUTOR() {
        return errorMessages_1.REGISTERED_AS_TUTOR;
    }
    static get REGISTERD_AS_PARENT() {
        return errorMessages_1.REGISTERD_AS_PARENT;
    }
    static get REGISTERD_AS_STUDENT() {
        return errorMessages_1.REGISTERD_AS_STUDENT;
    }
    static get USER_NOT_FOUND_TRY_AGAIN() {
        return errorMessages_1.USER_NOT_FOUND_TRY_AGAIN;
    }
    static get SUCCESS_SAVE_NEW_DETAILS() {
        return errorMessages_1.SUCCESS_ADD_NEW_DETAILS;
    }
    static get NEW_NUMBER_ALREADY_EXISTS() {
        return errorMessages_1.NEW_NUMBER_ALREADY_EXISTS;
    }
    static get OLD_NUMBER_DOES_NOT_EXISTS() {
        return errorMessages_1.OLD_NUMBER_DOES_NOT_EXISTS;
    }
    static get SUCCESSFULLY_UPDATED_DATA() {
        return errorMessages_1.SUCCESSFULLY_UPDATED_DATA;
    }
    static get REGISTERED_AS_PARENT() {
        return errorMessages_1.ALREADY_REGISTERED_PARENT;
    }
    static get USER_REGISTERED_AS_TUTOR() {
        return errorMessages_1.USER_ALREADY_REGISTERED_AS_TUTOR;
    }
    static get EMAIL_ALREADY_EXISTS() {
        return errorMessages_1.EMAIL_ALREADY_EXISTS;
    }
    static get NOT_ALLOWED_ON_WEB_FOR_LITE_USER() {
        return errorMessages_1.NOT_ALLOWED_ON_WEB_FOR_LITE_USER;
    }
    static get USER_NOT_REGISTERED() {
        return errorMessages_1.USER_NOT_REGISTERED;
    }
    static get COINS_CREDITED() {
        return errorMessages_1.COINS_CREDITED;
    }
    static get DEVICE_REGISTERED_SUCCESSFULLY() {
        return errorMessages_1.DEVICE_REGISTERED_SUCCESSFULLY;
    }
    static get SESSIONID_IS_MISSING() {
        return errorMessages_1.SESSIONID_IS_MISSING;
    }
    static get MOBILE_NUMBER_DIGIT() {
        return errorMessages_1.MOBILE_NUMBER_DIGIT;
    }
    static get INVALID_COUNTRY_CODE() {
        return errorMessages_1.INVALID_COUNTRY_CODE;
    }
    static get ALREADY_REGISTERED() {
        return errorMessages_1.ALREADY_REGISTERED;
    }
    static get MOBILE_EMAIL_REQUIRED() {
        return errorMessages_1.MOBILE_EMAIL_REQUIRED;
    }
    static get EMAIL_REQUIRED() {
        return errorMessages_1.EMAIL_REQUIRED;
    }
    static get MOBILE_REQUIRED() {
        return errorMessages_1.MOBILE_REQUIRED;
    }
    static get ILLEGAL_COLLATION() {
        return errorMessages_1.ILLEGAL_COLLATION;
    }
    static get USER_BLOCKED_ALREADY() {
        return errorMessages_1.USER_BLOCKED_ALREADY;
    }
    static get MOBILE_ALREADY_EXISTS() {
        return errorMessages_1.MOBILE_ALREADY_EXISTS;
    }
    static get USER_ALREADY_EXISTS_DIFF_TYPE() {
        return errorMessages_1.USER_ALREADY_EXISTS_DIFF_TYPE;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map