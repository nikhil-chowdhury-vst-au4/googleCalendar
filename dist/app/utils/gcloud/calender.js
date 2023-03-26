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
exports.setCalenderEvent = void 0;
const googleapis_1 = require("googleapis");
const user_1 = require("../../../models/user");
const { OAuth2 } = googleapis_1.google.auth;
const oAuth2Client = new OAuth2(process.env.GOOGLE_SSO_CLIENT_ID, process.env.GOOGLE_SSO_CLIENT_SECRET);
const setCalenderEvent = (payload, userDetails, attendee) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield user_1.default.findOne({
            where: {
                email: process.env.DEFAULT_GOOGLE_USER_EMAIL
            },
            attributes: ['refreshToken']
        });
        oAuth2Client.setCredentials({
            refresh_token: token && token.refreshToken
                ? token.refreshToken
                : process.env.DEFAULT_GOOGLE_REFRESH_TOKEN
        });
        const calendar = googleapis_1.google.calendar({
            version: 'v3',
            auth: oAuth2Client
        });
        const event = {
            summary: payload.title,
            location: ``,
            description: payload.query,
            start: {
                dateTime: payload.startTime,
                timeZone: 'Asia/Kolkata'
            },
            end: {
                dateTime: payload.endTime,
                timeZone: 'Asia/Kolkata'
            },
            conferenceData: {
                createRequest: {
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet'
                    },
                    requestId: String(payload.paymentId)
                }
            },
            attendees: [{ email: attendee }, { email: userDetails.email }],
            reminders: {
                useDefault: true
            },
            colorId: '2'
        };
        const eventData = yield calendar.events.insert({
            calendarId: 'primary',
            requestBody: Object.assign(Object.assign({}, event), { guestsCanInviteOthers: false, guestsCanModify: false, guestsCanSeeOtherGuests: false }),
            prettyPrint: true,
            conferenceDataVersion: 1,
            sendUpdates: 'all'
        });
        return eventData && eventData.data ? eventData.data : null;
    }
    catch (err) {
        console.log(err);
        return null;
    }
});
exports.setCalenderEvent = setCalenderEvent;
//# sourceMappingURL=calender.js.map