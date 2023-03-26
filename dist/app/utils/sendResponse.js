"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { ResponseBuilder } = require('base-packages');
const sendResponse = (req, res, statusCode, data = {}, message) => {
    if (typeof statusCode !== 'number') {
        throw new Error('statusCode should be a number');
    }
    let status = null;
    const lengthPattern = /^[0-9]{3}$/;
    if (!lengthPattern.test(`${statusCode}`)) {
        throw new Error('Invalid Status Code');
    }
    const pattern = /^2\d{2}$/;
    status = pattern.test(`${statusCode}`) ? 'success' : 'failure';
    const responseBuilderObj = new ResponseBuilder(statusCode, data, message, {
        lang: req.header('Accept-Language')
    });
    return res.status(statusCode).header('Cache-Control', 'no-cache').json({
        status,
        data,
        message: responseBuilderObj.message
    });
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map