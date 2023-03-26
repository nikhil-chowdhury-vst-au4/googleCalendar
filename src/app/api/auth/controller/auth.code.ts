const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import AuthService from '../service/auth.code.service';

export default class GetOtp extends MasterController {
    static doc() {
        return {
            tags: ['Auth'],
            description: 'Get Code',
            summary: 'Get Code'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                code: Joi.string().required(),
                redirect_uri: Joi.string().required(),
                campaign: Joi.string().optional().allow('').default(null),
                source: Joi.string().optional().allow('').default(null),
                medium: Joi.string().optional().allow('').default(null),
                signupPoint: Joi.string().optional().allow('').default(null)
            })
        );
        return payload;
    }

    async controller() {
        try {
            const {
                code,
                redirect_uri,
                campaign,
                source,
                medium,
                signupPoint
            } = this.data;
            const result = await AuthService.register(
                code,
                redirect_uri,
                source,
                campaign,
                medium,
                signupPoint
            );
            return new this.ResponseBuilder(
                result.statusCode,
                result.data,
                result.message
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
