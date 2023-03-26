"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class Guest extends common_1.default {
    static get ERROR_USER_AS_GEUST() {
        return errorMessages_1.GUEST_CANT_LOGIN;
    }
    static get IMAGE_URL() {
        return 'https://whitelabel-assets.s3.ap-south-1.amazonaws.com/production/single/learn/504d8768-776b-4dd8-8b0e-36ee617e6876.png';
    }
    static get GUEST_NAME() {
        return errorMessages_1.GUEST_USER;
    }
}
exports.default = Guest;
//# sourceMappingURL=guest.js.map