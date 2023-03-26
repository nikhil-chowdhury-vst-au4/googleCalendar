"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../config/constants/common");
const { ResponseBuilder } = require('base-packages');
class CustomError extends Error {
    constructor(message, dataObj = {}) {
        super(message);
        this.type = 'CustomError';
        this.data = dataObj;
        console.log('CustomError occur, ', message);
    }
    response(status = 400, msg = null, intl = {
        lang: 'en',
        fn: '__mf',
        params: { name: '' }
    }) {
        let isProd = process.env.NODE_ENV === 'production';
        if (typeof status === 'string') {
            msg = status;
            status = 400;
        }
        return new ResponseBuilder(isProd ? 500 : status, isProd ? {} : this.data, isProd ? common_1.default.ERROR_500 : msg ? msg : this.message, intl);
    }
}
exports.default = CustomError;
//# sourceMappingURL=common.error.js.map