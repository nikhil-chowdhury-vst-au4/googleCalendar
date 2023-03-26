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
const getPMSTokenForFrontend = ({ paymentSource = null, prefillData = null, gatewayOrderId = null, orderId = null, orgImageUrl = null, userId = null, returnUrl, gatewayCode = 'rzp' }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (gatewayOrderId && orderId) {
            return jwt.sign({
                paymentSource,
                gatewayCode,
                prefillData,
                gatewayOrderId,
                orderId,
                returnUrl,
                orgImageUrl
            }, process.env.PAYMENT_AUTH_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                algorithm: process.env.ACCESS_TOKEN_ALGO
            });
        }
        else {
            return jwt.sign({ returnUrl, orderId, gatewayCode }, process.env.PAYMENT_AUTH_SECRET, {
                expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                algorithm: process.env.ACCESS_TOKEN_ALGO
            });
        }
    }
    catch (err) {
        console.log('\n\nSomething is wrong with hash provided.\n\n', err);
        return null;
    }
});
exports.default = getPMSTokenForFrontend;
//# sourceMappingURL=generate.frontend.token.js.map