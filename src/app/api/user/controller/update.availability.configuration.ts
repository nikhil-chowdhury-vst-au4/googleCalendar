const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class SetUserAvailabilityConfiguration extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Set availity configuration',
            summary:
                'set availity configuration and min-max window for bookings'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                maxWindow: Joi.number().integer().optional(),
                periodType: Joi.string().optional(),
                periodValue: Joi.number().integer().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await UserService.setAvailibilityConfigurationOfUser(
                this.data,
                this.req.user
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
