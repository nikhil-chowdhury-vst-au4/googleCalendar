"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class Profile extends common_1.default {
    static get UNABLE_TO_IDENTIFY_USER_TYPE() {
        return errorMessages_1.UNABLE_TO_IDENTIFY_USER_TYPE;
    }
    static get UPDATE_DATA_SUCCESS() {
        return errorMessages_1.UPDATE_DATA_SUCCESS;
    }
    static get NOTHING_TO_UPDATE() {
        return errorMessages_1.NOTHING_TO_UPDATE;
    }
    static get UNABLE_TO_IDENTIFY_TUTOR() {
        return errorMessages_1.UNABLE_TO_IDENTIFY_TUTOR;
    }
    static get BANK_DETAILS_ALREADY_ADDED() {
        return errorMessages_1.BANK_DETAILS_ALREADY_ADDED;
    }
    static get TAB_UPDATE_DATA_SUCCESS() {
        return errorMessages_1.TAB_UPDATE_DATA_SUCCESS;
    }
    static get INSUFFICIENT_BANK_DETAILS() {
        return errorMessages_1.INSUFFICIENT_BANK_DETAILS;
    }
}
exports.default = Profile;
//# sourceMappingURL=profile.js.map