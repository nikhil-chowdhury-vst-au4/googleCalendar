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
exports.getGoogleProfileData = exports.generateTokenViaClient = exports.generateToken = void 0;
let axios = require('axios').default;
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_SSO_CLIENT_ID, process.env.GOOGLE_SSO_CLIENT_SECRET, process.env.ENVIRONMENT == 'local'
    ? 'http://localhost:8080'
    : 'http://localhost:8080');
const generateToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                code,
                client_id: process.env.GOOGLE_SSO_CLIENT_ID,
                client_secret: process.env.GOOGLE_SSO_CLIENT_SECRET,
                redirect_uri: 'http://localhost:8080',
                grant_type: 'authorization_code'
            }
        };
        const response = yield axios.request(options);
        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token
        };
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.generateToken = generateToken;
const generateTokenViaClient = (code, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_SSO_CLIENT_ID, process.env.GOOGLE_SSO_CLIENT_SECRET, redirect_uri);
        let { tokens } = yield oauth2Client.getToken(code);
        const response = tokens;
        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token
        };
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.generateTokenViaClient = generateTokenViaClient;
const getGoogleProfileData = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        oauth2Client.setCredentials({ access_token: token });
        let oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        const { data: response } = yield oauth2.userinfo.get();
        console.log(response);
        return {
            email: response.email,
            name: response.name,
            picture: response.picture
        };
    }
    catch (e) {
        console.log(e);
        return false;
    }
});
exports.getGoogleProfileData = getGoogleProfileData;
//# sourceMappingURL=token.js.map