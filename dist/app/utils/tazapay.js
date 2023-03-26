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
const crypto = require('crypto');
const axios = require('axios');
const countryData = globalThis.countryData;
class Tazapay {
    constructor(url, method, region, tzpDiyApiKey, tzpDiyApiSecret) {
        this.baseUrl = process.env.TAZAPAY_BASE_URL;
        this.salt = process.env.TAZAPAY_SALT;
        this.response = null;
        this.url = url;
        this.method = method;
        this.apiKey = tzpDiyApiKey
            ? tzpDiyApiKey
            : countryData[region].TAZAPAY_API_KEY;
        this.apiSecret = tzpDiyApiSecret
            ? tzpDiyApiSecret
            : countryData[region].TAZAPAY_API_SECRET;
    }
    generateSignature() {
        let signature, timestamp = Math.round(new Date().getTime() / 1000);
        let to_sign = this.method +
            this.url +
            this.salt +
            timestamp +
            this.apiKey +
            this.apiSecret;
        let hash = crypto.createHmac('sha256', this.apiSecret);
        hash.update(to_sign);
        signature = Buffer.from(hash.digest('hex')).toString('base64');
        return {
            signature,
            timestamp
        };
    }
    call(payload = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { signature, timestamp } = this.generateSignature();
                let config = {
                    method: this.method.toLowerCase(),
                    url: this.baseUrl + this.url,
                    headers: {
                        timestamp,
                        salt: this.salt,
                        accesskey: this.apiKey,
                        signature,
                        'Content-Type': 'application/json'
                    }
                };
                if (this.method != 'GET') {
                    config['data'] = payload;
                }
                this.response = yield axios(config);
            }
            catch (error) {
                console.log('[TazapayError]::[call method]', error);
                this.response = null;
            }
            return this;
        });
    }
}
exports.default = Tazapay;
//# sourceMappingURL=tazapay.js.map