"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobilePatternWithoutCountryCode = exports.mobilePatternInternational = exports.mobilePattern = void 0;
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
exports.mobilePattern = /^[9][1][6789]\d{9}$/;
exports.mobilePatternInternational = /^(\+\d{1,7}[- ]?)?\d{5,20}$/;
exports.mobilePatternWithoutCountryCode = /^[6789]\d{9}$/;
class Tutor extends common_1.default {
    static get EXPIRY_EXTEND_ERROR_NO_TUTOR() {
        return errorMessages_1.CANNOT_EXTEND_EXPIRY;
    }
    static get PREMIUM_DATA_CAHANGE() {
        return errorMessages_1.PREMIUM_DURATION_CHANGED;
    }
    static get BAD_CLIENT_MISSING_USER_400() {
        return errorMessages_1.BAD_CLIENT_MISSING_USER_400;
    }
    static get ACCESS_403_TUTORS_ONLY() {
        return errorMessages_1.ACCESS_403_TUTORS_ONLY;
    }
    static get USER_REGISTERED_AS_STUDENT() {
        return errorMessages_1.USER_REGISTERED_AS_PARENT_STUDENT;
    }
    static get TUTOR_ALREADY_EXISTS() {
        return errorMessages_1.TUTOR_WITH_NUMBER_ALREADY_EXISTS;
    }
    static get DATA_FETCHED_SUCCESSFULLY() {
        return errorMessages_1.DATA_FETCHED_SUCCESSFULLY;
    }
    static get INVALID_STUDENT_COLLECTION_NO_PARENT_DETAILS() {
        return errorMessages_1.INVALID_STUDENT_COLLECTION;
    }
    static get UNABLE_TO_INSERT_USERS_DATA() {
        return errorMessages_1.UNABLE_TO_INSERT_DATA;
    }
    static get UNABLE_TO_INSERT_PARENTS_DATA() {
        return errorMessages_1.UNABLE_TO_INSERT_PARENTS_DATA;
    }
    static get INVALID_STUDENT_COLLECTION_NO_PARENTID_PROVIDED() {
        return errorMessages_1.INVALID_STUDENT_NO_PARENTID;
    }
    static get PARENTS_SUCCESSFULLY_ADDED_FOR_STUDENTS() {
        return errorMessages_1.PARENTS_ADDED;
    }
    static get UNABLE_TO_IDENTIFY() {
        return errorMessages_1.UNABLE_TO_IDENTIFY;
    }
    static get TOO_LARGE_DATA() {
        return errorMessages_1.TOO_LARGE_DATA;
    }
}
exports.default = Tutor;
//# sourceMappingURL=tutor.js.map