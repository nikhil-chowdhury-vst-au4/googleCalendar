"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgForTransactionCount = exports.randomIntFromInterval = exports.getTinyUrl = exports.getRoundOfTotalStudents = exports.getYear = exports.getMonth = exports.getDate = exports.isInvalidField = exports.apiCall = void 0;
const axios = require('axios');
const error_utils_1 = require("./error.utils");
const { FORMAT_HTTP_HEADERS } = require('opentracing');
const tinyUrl = require('tinyurl');
const apiCall = function (apiOptions, span) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiCallSpan = global['tracer'].startSpan('api-call', { childOf: span });
        try {
            apiOptions.headers = apiOptions.headers || {
                Accept: 'application/json;charset=UTF-8'
            };
            apiOptions.responseType = apiOptions.responseType || 'json';
            apiOptions.method = apiOptions.method || 'POST';
            global['tracer'].inject(apiCallSpan, FORMAT_HTTP_HEADERS, apiOptions.headers);
            (0, error_utils_1.log)('info', {
                msg: 'Routing',
                url: apiOptions.url
            });
            let response = yield axios(apiOptions);
            apiCallSpan.finish();
            return {
                err: null,
                response: response.data,
                span: apiCallSpan
            };
        }
        catch (err) {
            (0, error_utils_1.log)('error', {
                message: 'Error in routing url',
                url: apiOptions.url,
                err: err
            }, apiCallSpan);
            apiCallSpan.finish();
            return {
                err: err,
                response: null,
                span: apiCallSpan
            };
        }
    });
};
exports.apiCall = apiCall;
const isInvalidField = (fields, invalidFields) => {
    return fields.some((field) => invalidFields.includes(field));
};
exports.isInvalidField = isInvalidField;
const getDate = (date) => {
    return date.getDate();
};
exports.getDate = getDate;
const getMonth = (date) => {
    return date.getMonth() + 1;
};
exports.getMonth = getMonth;
const getYear = (date) => {
    return date.getFullYear();
};
exports.getYear = getYear;
const getRoundOfTotalStudents = (num) => {
    let formattedNum;
    if (num > 9 && num < 100) {
        formattedNum =
            Math.sign(num) * (Math.floor(Math.abs(num) / 10) * 10) + '+';
    }
    else if (num > 99 && num < 1000) {
        formattedNum =
            Math.sign(num) * (Math.floor(Math.abs(num) / 100) * 100) + '+';
    }
    else if (num > 999 && num < 1000000) {
        formattedNum = Math.sign(num) * Math.floor(Math.abs(num) / 1000) + 'k+';
    }
    else if (num > 999999 && num < 1000000000) {
        formattedNum =
            Math.sign(num) * Math.floor(Math.abs(num) / 1000000) + 'M+';
    }
    return formattedNum;
};
exports.getRoundOfTotalStudents = getRoundOfTotalStudents;
const getTinyUrl = (link) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            tinyUrl.shorten(link, function (res, err) {
                if (err) {
                    console.error('Error in creating tiny link', err);
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    catch (err) {
        console.error('Error shortening link with Tiny', err);
    }
});
exports.getTinyUrl = getTinyUrl;
const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomIntFromInterval = randomIntFromInterval;
exports.orgForTransactionCount = {
    1: 25,
    8725: 25
};
//# sourceMappingURL=api.utils.js.map