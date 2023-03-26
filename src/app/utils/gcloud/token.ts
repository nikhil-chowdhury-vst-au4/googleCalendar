let axios = require('axios').default;

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_SSO_CLIENT_ID,
    process.env.GOOGLE_SSO_CLIENT_SECRET,
    process.env.ENVIRONMENT == 'local'
        ? 'http://localhost:8080'
        : 'http://localhost:8080'
);

// : 'https://classplusapp.com/test1/'

export const generateToken = async (code: string) => {
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

        const response = await axios.request(options);
        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token
        };
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const generateTokenViaClient = async (
    code: string,
    redirect_uri: string
) => {
    try {
        let oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_SSO_CLIENT_ID,
            process.env.GOOGLE_SSO_CLIENT_SECRET,
            redirect_uri
        );
        let { tokens } = await oauth2Client.getToken(code);

        const response = tokens;

        return {
            access_token: response.access_token,
            refresh_token: response.refresh_token
        };
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const getGoogleProfileData = async (token: string) => {
    try {
        oauth2Client.setCredentials({ access_token: token });
        let oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data: response } = await oauth2.userinfo.get();
        console.log(response);
        return {
            email: response.email,
            name: response.name,
            picture: response.picture
        };
    } catch (e) {
        console.log(e);
        return false;
    }
};
