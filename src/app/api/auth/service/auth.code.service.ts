import CommonService from '../../../utils/common.service';
import {
    BAD_CLIENT_REQUEST_400,
    SUCCESS_200
    // ACCEPTED
} from '../../../../config/constants/errorMessages';
import { sign, SignOptions } from 'jsonwebtoken';
import User from '../../../../models/user';
import {
    // generateToken,
    generateTokenViaClient,
    getGoogleProfileData
} from '../../../utils/gcloud/token';
import userService from '../../user/services/user.service';

class AuthService extends CommonService {
    async register(
        code: string,
        redirect_uri: string,
        source: string | null,
        campaign: string | null,
        medium: string | null,
        signupPoint: string | null
    ) {
        try {
            console.log('source', source, campaign, medium);
            const tokenData = await generateTokenViaClient(code, redirect_uri);
            if (!tokenData) {
                return {
                    statusCode: 400,
                    message: 'wrong code provided',
                    data: {}
                };
            }

            const getGoogleProfile = await getGoogleProfileData(
                tokenData.access_token
            );

            if (!getGoogleProfile) {
                return {
                    statusCode: 400,
                    message: BAD_CLIENT_REQUEST_400,
                    data: {}
                };
            }

            console.log(tokenData);

            const user = await User.findOne({
                where: {
                    email: getGoogleProfile.email
                }
            });

            const availability = user
                ? await userService.getUserRuleById(user.id)
                : null;

            const userCreateData = {
                name: getGoogleProfile.name,

                email: getGoogleProfile.email,
                googleUrl: getGoogleProfile.picture,
                refreshToken: tokenData.refresh_token,
                ...(source && { source: source }),
                ...(campaign && { campaign: campaign }),
                ...(medium && { medium: medium }),
                ...(signupPoint && { signupPoint: signupPoint })
            };
            console.log('userCreateData :; ', userCreateData);
            const userData = user || (await User.create(userCreateData));

            const payload = {
                id: userData.id,
                email: userData.email
            };
            const token = sign(payload, process.env.TOKEN_SECRET, <SignOptions>{
                expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                algorithm: process.env.ACCESS_TOKEN_ALGO
            });

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: {
                    token,
                    exists: user ? 1 : 0,
                    onboardingStatus: Boolean(availability)
                }
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new AuthService();
