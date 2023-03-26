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
var jwt = require('jsonwebtoken');
const constant_1 = require("../config/constant");
const sendResponse_1 = require("../app/utils/sendResponse");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        req.isAuthenticated = true;
        return next();
    }
    req.isAuthenticated = false;
    let token = req.header('x-access-token') || req.query['x-access-token'];
    try {
        if (!token) {
            return (0, sendResponse_1.default)(req, res, 401, [{ tokenExpired: 0 }], constant_1.AUTH_TOKEN.TOKEN_MISSING_400);
        }
        const decoded = yield jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decoded.id) {
            console.warn('Unable to find user Id in access token', token);
            return (0, sendResponse_1.default)(req, res, 401, [{ tokenExpired: 1 }], constant_1.AUTH_TOKEN.TOKEN_INVALID_401);
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        return (0, sendResponse_1.default)(req, res, 401, [{ tokenExpired: 0 }], constant_1.AUTH_TOKEN.TOKEN_ERROR_400);
    }
});
exports.default = isAuthenticated;
//# sourceMappingURL=isAuthenticated.js.map