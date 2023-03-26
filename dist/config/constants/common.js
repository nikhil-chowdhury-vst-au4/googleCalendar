"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMessages_1 = require("./errorMessages");
class Common {
    static get FINGERPRINT_ID_REQUIRED() {
        return errorMessages_1.FINGERPRINT_ID_REQUIRED;
    }
    static get ORG_ID_REQUIRED() {
        return errorMessages_1.ORG_ID_REQUIRED;
    }
    static get DATA_ADDED_SUCCESS() {
        return errorMessages_1.ADDED_SUCCESSFULLY;
    }
    static get ERROR_NOT_FOUND() {
        return errorMessages_1.NOT_FOUND;
    }
    static get ERROR_SERVICE_NOT_WORKING() {
        return errorMessages_1.SERVICE_NOT_WORKING;
    }
    static get SUCCESS() {
        return errorMessages_1.SUCCESS_200;
    }
    static get ERROR_500() {
        return errorMessages_1.BAD_INTERNAL_500;
    }
    static get DEFAULT_CREATED() {
        return errorMessages_1.SUCCESSFULLY_CREATED;
    }
    static get DEFAULT_UPDATED() {
        return errorMessages_1.SUCCESSFULLY_UPDATED;
    }
    static get DEFAULT_LISTED() {
        return errorMessages_1.SUCCESSFULLY_LISTED;
    }
    static get DEFAULT_DELETED() {
        return errorMessages_1.SUCCESSFULLY_DELETED;
    }
    static get UNLOCK_ALL_APP() {
        return errorMessages_1.UNLOCK_ALL_APP;
    }
    static get SUCCESS_LOGIN() {
        return errorMessages_1.LOGIN_SUCCESSFULL;
    }
    static get DATA_NOT_FOUND() {
        return errorMessages_1.DATA_NOT_FOUND;
    }
    static get BAD_REQUEST() {
        return errorMessages_1.BAD_CLIENT_REQUEST_400;
    }
    static get ACCESS_403() {
        return errorMessages_1.ACCESS_403;
    }
    static get UPLOAD_SUCCESSFUL() {
        return errorMessages_1.UPLOAD_SUCCESSFUL;
    }
    static get CONTACT_NOT_FOUND() {
        return errorMessages_1.CONTACT_NOT_FOUND;
    }
    static get CONTACT_FETCH() {
        return errorMessages_1.USER_LIST_FETCHED;
    }
    static get DATA_NOT_RECORDED() {
        return errorMessages_1.BAD_INTERNAL_500_CHECK_INPUT;
    }
    static get DATA_RECORDED() {
        return errorMessages_1.DATA_RECORDED_SUCESSFULLY;
    }
    static get INTERNAL_SERVER() {
        return errorMessages_1.INTERNAL_SERVER_ERROR;
    }
    static get DEFAULT_SAVED() {
        return errorMessages_1.SUCCESSFULLY_SAVED;
    }
    static get ERROR_SAVING_DETAILS() {
        return errorMessages_1.ERROR_SAVING_DETAILS;
    }
    static get ERROR_SAVING_TUTOR_CATEGORY() {
        return errorMessages_1.ERROR_ADDING_NEW_CATEGORY;
    }
    static get SUCCESSFUL_FETCH() {
        return errorMessages_1.SUCCESSFULLY_FETCHED;
    }
    static get UNABLE_TO_FETCH() {
        return errorMessages_1.UNABLE_TO_FETCH_DATA;
    }
    static get UNABLE_SAVE_DETAILS() {
        return errorMessages_1.UNABLE_TO_SAVE_PREFERENCES;
    }
    static get INVALID_MOBILE_NUMBER() {
        return errorMessages_1.INVALID_MOBILE_NUMBER;
    }
    static get ALL_FIELDS_REQUIRED() {
        return errorMessages_1.PLEASE_PROVIDE_ALL_FIELDS;
    }
    static get INVALID_INPUTS() {
        return errorMessages_1.PLEASE_PROVIDE_VALID_INPUTS;
    }
    static get UPDATED_SUCCESSFULLY() {
        return errorMessages_1.SUCCESSFULLY_UPDATED;
    }
    static get INVALID_CONTACTS() {
        return errorMessages_1.INVALID_CONTACTS;
    }
    static get INVALID_NUMBER() {
        return errorMessages_1.INVALID_NUMBER;
    }
    static get SUCCESSFULLY_INSERTED() {
        return errorMessages_1.SUCCESSFULLY_INSERTED;
    }
    static get ERR_PROCESSING_REQ() {
        return errorMessages_1.ERR_PROCESSING_REQ;
    }
    static get INCORRECT_ACTION() {
        return errorMessages_1.INCORRECT_ACTION;
    }
    static get CANNOT_ADD_YOURSELF() {
        return errorMessages_1.CANNOT_ADD_YOURSELF;
    }
    static get SUCCESS_SAVE_NEW_DETAILS() {
        return errorMessages_1.SUCCESS_SAVE_NEW_DETAILS;
    }
    static get TABS_FETCH_SUCCESS() {
        return errorMessages_1.TABS_FETCH_SUCCESS;
    }
    static get INVALID_USER() {
        return errorMessages_1.INVALID_USER_ORG;
    }
    static get UNRECOGNIZED_TAB_CATEGORY() {
        return errorMessages_1.UNRECOGNIZED_TAB_CATEGORY;
    }
    static get CARETAKER_ADDED_SUCCESSFULLY() {
        return errorMessages_1.CARETAKER_ADDED_SUCCESSFULLY;
    }
    static get CARETAKER_ALREAY_EXISTS() {
        return errorMessages_1.CARETAKER_ALREAY_EXISTS;
    }
    static get USER_REGISTERED_AS_PARENT_OR_STUDENT() {
        return errorMessages_1.USER_REGISTERED_AS_PARENT_OR_STUDENT;
    }
    static get NO_CARETAKER_TO_ADD() {
        return errorMessages_1.NO_CARETAKER_TO_ADD;
    }
    static get FAILED_TO_ADD_CARETAKERS() {
        return errorMessages_1.FAILED_TO_ADD_CARETAKERS;
    }
    static get SEQUELIZE_DATABASE_ERROR() {
        return errorMessages_1.SEQUELIZE_DATABASE_ERROR;
    }
    static get NO_DATA_TO_UPDATE() {
        return errorMessages_1.NO_DATA_TO_UPDATE;
    }
    static get DUPLICATE_ELEMENT() {
        return errorMessages_1.DUPLICATE_ELEMENT;
    }
    static get SUCCESS_REGISTERED() {
        return errorMessages_1.SUCCESS_REGISTERED;
    }
    static get FAILED_TO_ADD_USER() {
        return errorMessages_1.FAILED_TO_ADD_USER;
    }
    static get ERROR_EMAIL_UPDATE() {
        return errorMessages_1.ERROR_EMAIL_UPDATE;
    }
    static get MAX_DEVICES_LOGIN_REACHED() {
        return errorMessages_1.MAX_DEVICES_LOGIN_REACHED;
    }
    static get ONLY_SINGLE_DEVICE_LOGIN_ALLOWED() {
        return errorMessages_1.ONLY_SINGLE_DEVICE_LOGIN_ALLOWED;
    }
    static get INVALID_DEVICES_ALLOWED() {
        return errorMessages_1.INVALID_DEVICES_ALLOWED;
    }
    static get SUBSCRIPTION_MAPPING() {
        return {
            Weekly: 7,
            Monthly: 30,
            '2 Months': 60,
            '3 Months': 90,
            '6 Months': 180,
            '1 Year': 365,
            '2 Weeks': 14
        };
    }
    static get CUSTOM_SUBSCRIPTION_MAPPING() {
        return {
            Months: 30,
            Days: 1
        };
    }
    static get DAYS_SUBSCRIPTION_MAPPING() {
        return {
            7: 'Weekly',
            30: 'Monthly',
            60: '2 Months',
            90: '3 Months',
            180: '6 Months',
            365: '1 Year',
            14: '2 Weeks'
        };
    }
    static get docMapping() {
        return {
            video: 'https://storage.googleapis.com/cp-assets-public-staging/assets/video.png',
            pdf: 'https://storage.googleapis.com/cp-assets-public-staging/assets/pdf.png',
            doc: 'https://storage.googleapis.com/cp-assets-public-staging/assets/document.png',
            image: 'https://storage.googleapis.com/cp-assets-public-staging/assets/image.png'
        };
    }
    static get EXTENSION_MAPPING() {
        return {
            'application/pdf': '.pdf',
            'image/png': '.png',
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg'
        };
    }
    static get bookingIdToHashMapping() {
        return {
            0: 'dFb',
            1: 'ZuI',
            2: 'Olk',
            3: 'Rwa',
            4: 'Jgf',
            5: 'YeB',
            6: 'vcq',
            7: 'Dhm',
            8: 'nPs',
            9: 'TX4'
        };
    }
    static get hashToBookingIdMapping() {
        return {
            dFb: 0,
            ZuI: 1,
            Olk: 2,
            Rwa: 3,
            Jgf: 4,
            YeB: 5,
            vcq: 6,
            Dhm: 7,
            nPs: 8,
            TX4: 9
        };
    }
}
exports.default = Common;
//# sourceMappingURL=common.js.map