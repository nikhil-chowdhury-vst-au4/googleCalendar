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
exports.sendMailGunMail = void 0;
const API_KEY = 'key-7096e59c56730e9638ed4c44f9af4fdb';
const DOMAIN = 'cms.classplus.co';
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const client = mailgun.client({
    username: 'api',
    key: API_KEY
});
const sendMailGunMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(data);
        const result = yield client.messages.create(DOMAIN, data);
        console.log(result);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.sendMailGunMail = sendMailGunMail;
//# sourceMappingURL=mailgun.manual.js.map