"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class Organization extends common_1.default {
    static get DRAWER_400() {
        return errorMessages_1.DRAWER_NOT_WORKING;
    }
    static get HOMETABS_400() {
        return errorMessages_1.DRAWER_NOT_WORKING;
    }
    static get ORGMETA_400() {
        return errorMessages_1.DRAWER_NOT_WORKING;
    }
    static get HOMETABS_405() {
        return errorMessages_1.INVALID_FIELDS;
    }
    static get WRONG_DOOR() {
        return errorMessages_1.ENTERED_WRONG_DOOR;
    }
    static get NO_PREMIUM() {
        return errorMessages_1.NOT_TUTOR_OR_PREMIUM;
    }
    static get ERROR_REQUEST_REVIEW_URL() {
        return errorMessages_1.ERROR_GENERATING_URL;
    }
    static get ERROR_DUPLICATE_ORG_CODE() {
        return errorMessages_1.TRY_WITH_DIFF_ORGCODE;
    }
    static get DEFAULT_iOS_FIREBASE_ID() {
        return 'classsplus-2f8f2';
    }
    static get INVALID_ORGCODE() {
        return errorMessages_1.INVALID_ORGCODE;
    }
    static get APP_FOR_PLATFORM_NOT_PUBLISHED() {
        return errorMessages_1.APP_FOR_PLATFORM_NOT_PUBLISHED;
    }
    static get INVALID_ORGANIZATION() {
        return errorMessages_1.INVALID_ORG;
    }
    static get STORE_DEACTIVATED() {
        return errorMessages_1.STORE_DEACTIVATED;
    }
    static get NOTHING_TO_UPDATE() {
        return errorMessages_1.NOTHING_TO_UPDATE;
    }
    static get ORG_NOT_FOUND() {
        return errorMessages_1.ORG_NOT_FOUND;
    }
    static get FOCRE_STATUS_GET_SUCCESSFULLY() {
        return errorMessages_1.FORCE_UPDATE_STATUS_FETCHED;
    }
    static get DRAWER_NOT_FOUND() {
        return errorMessages_1.DRAWER_NOT_FOUND;
    }
    static get DRAWER_FOUND() {
        return errorMessages_1.DRAWER_DETAILS_FETCHED;
    }
    static get DRAWER_DATA_NOT_FOUND() {
        return errorMessages_1.NO_DATA_FOUND_FOR_ORG;
    }
    static get DRAWER_DATA_FOUND() {
        return errorMessages_1.DRAWER_DETAILS_FETCHED;
    }
    static get DRAWER_ICON_URL_NOT_FOUND() {
        return errorMessages_1.DRAWER_DETAILS_FETCHED;
    }
    static get COINS_NOT_ENOUGH_TO_REDEEM() {
        return errorMessages_1.NOT_ENOUGH_COINS;
    }
    static get COINS_UPDATE_SUCCESS() {
        return errorMessages_1.COINS_REDEEMED_AND_LEFT;
    }
    static get INVALID_USERID() {
        return errorMessages_1.INVALID_USERID;
    }
    static get FETCH_HOME_TAB() {
        return errorMessages_1.FETCHED_HOME_TABS;
    }
    static get INVALID_WEB_ADDRESS() {
        return errorMessages_1.INVALID_WEB_ADDRESS;
    }
    static get INPUT_FIELDS_MISSING() {
        return errorMessages_1.INPUT_FIELDS_MISSING;
    }
    static get INVALID_EMAIL_ADDRESS() {
        return errorMessages_1.INVALID_EMAIL_ADDRESS;
    }
    static get DEEPLINK_MISSING() {
        return errorMessages_1.DEEPLINK_MISSING;
    }
    static get ORG_CODE_MISSING() {
        return errorMessages_1.ORG_CODE_MISSING;
    }
    static get FILTER_EMPTY() {
        return errorMessages_1.FILTER_EMPTY;
    }
    static get INVALID_COUNTRY_EXT() {
        return errorMessages_1.INVALID_COUNTRY_EXT;
    }
    static get ACTIVE_COUNT_EXCEED() {
        return 'Only 5 tabs can be active';
    }
    static get TAB_NOT_PRESENT() {
        return 'Requested tab cannot be updated, as it is not present in db';
    }
    static get TAB_ALREADY_PRESENT() {
        return 'Tabs already inserted use update API';
    }
}
exports.default = Organization;
//# sourceMappingURL=organization.js.map