import { sign, SignOptions } from 'jsonwebtoken';

const axios = require('axios');

export default async function sendEmail(
    email: string[],
    subject: string,

    templateId: number,
    templateData?: any
) {
    try {
        const accessToken = await generateMailToken();
        const payload = {
            orgId: parseInt(process.env.COMM_ACCESS_SMS_ORG_ID),
            senderId: parseInt(process.env.COMM_ACCESS_EMAIL_SENDER_ID),
            service: 1,
            email: {
                subject: subject,
                to: email,
                from:
                    process.env.ENVIRONMENT == 'production'
                        ? 'scheduling@meetpro.club'
                        : 'info@fankonnect.com'
            },
            templateId: templateId,
            templateData: templateData,
            priority: 'P2'
        };
        const headers = {
            headers: {
                'access-token': accessToken,
                'Content-Type': 'application/json'
            }
        };

        let data = await axios.post(
            `${process.env.COMMUNICATION_SERVICE}/v2/addCommunication/email/internal`,
            payload,
            headers
        );
        console.log(data);
        return data;
    } catch (e) {
        console.log('[OTP]:[sendEmailOTP]', e);
        // throw new Error('Failed to send email');
    }
}

async function generateMailToken() {
    const payload = {
        clientId: process.env.COMM_SERVICE_CLIENT_ID,
        clientSecret: process.env.COMM_SERVICE_CLIENT_SECRET
    };
    const token = await sign(payload, process.env.COMM_TOKEN_SECRET, <
        SignOptions
    >{
        expiresIn: process.env.COMM_TOKEN_EXPIRY_DURATION,
        algorithm: process.env.COMM_ACCESS_TOKEN_ALGO
    });
    return token;
}
