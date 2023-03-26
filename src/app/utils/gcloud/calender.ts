// Require google from googleapis package.

import { google } from 'googleapis';
import User from '../../../models/user';

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth;

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
    process.env.GOOGLE_SSO_CLIENT_ID,
    process.env.GOOGLE_SSO_CLIENT_SECRET
);

export const setCalenderEvent = async (
    payload: any,
    userDetails: any,
    attendee: string
) => {
    try {
        // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
        const token = await User.findOne({
            where: {
                email: process.env.DEFAULT_GOOGLE_USER_EMAIL
            },
            attributes: ['refreshToken']
        });
        oAuth2Client.setCredentials({
            refresh_token:
                token && token.refreshToken
                    ? token.refreshToken
                    : process.env.DEFAULT_GOOGLE_REFRESH_TOKEN
        });

        // Create a new calender instance.
        const calendar = google.calendar({
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
                // overrides: [
                //     {
                //         method: 'email',
                //         minutes: 30
                //     },
                //     {
                //         method: 'popup',
                //         minutes: 30
                //     },
                //     {
                //         method: 'popup',
                //         minutes: 24 * 60
                //     }
                // ]
            },
            colorId: '2'
        };

        const eventData = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                ...event,
                guestsCanInviteOthers: false,
                guestsCanModify: false,
                guestsCanSeeOtherGuests: false
            },
            prettyPrint: true,
            conferenceDataVersion: 1,
            sendUpdates: 'all'
        });

        return eventData && eventData.data ? eventData.data : null;
    } catch (err) {
        console.log(err);
        return null;
    }
};
