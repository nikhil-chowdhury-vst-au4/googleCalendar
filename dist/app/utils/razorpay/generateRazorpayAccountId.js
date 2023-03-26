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
const rp = require('request-promise');
const razorpayRequestPayload_1 = require("./razorpayRequestPayload");
const generateRazorpayAccountId = (beneficiaryName, email, accountNumber, ifscCode) => __awaiter(void 0, void 0, void 0, function* () {
    let accountIdObject = null, response = null;
    try {
        response = yield rp((0, razorpayRequestPayload_1.default)(beneficiaryName, email, ifscCode, accountNumber));
        accountIdObject = { accountId: JSON.parse(response).id };
        return accountIdObject;
    }
    catch (e) {
        let errorDescription = JSON.parse(e.error).error.description;
        let error = new Error(errorDescription);
        error.name = 'ValidationError';
        throw error;
    }
});
exports.default = generateRazorpayAccountId;
//# sourceMappingURL=generateRazorpayAccountId.js.map