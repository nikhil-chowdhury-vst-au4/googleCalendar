"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class Token extends common_1.default {
    static get ERROR_TOKEN_EXP() {
        return errorMessages_1.TOKEN_EXPIRED_400;
    }
    static get ERROR_TOKEN_INVALID() {
        return errorMessages_1.TOKEN_INVALID;
    }
    static get TOKEN_ISSUED() {
        return errorMessages_1.TOKEN_ISSUED;
    }
    static get ERROR_TOKEN_EXP_NAME() {
        return errorMessages_1.TOKEN_EXPIRED_ERROR;
    }
    static get ERORR_JSON_WEB_ROKEN() {
        return errorMessages_1.JSON_WEB_TOKEN_ERROR;
    }
}
exports.default = Token;
//# sourceMappingURL=token.js.map