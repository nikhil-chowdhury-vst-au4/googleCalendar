const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class SendCreateOrUpdateProfile extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'send creator marketing messages ',
            summary: 'send creator marketing messages '
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                limit: Joi.number().min(1).optional(),
                offset: Joi.number().min(0).optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await UserService.sendCreatorMarketingMessages(
                this.data.limit,
                this.data.offset
            );
        } catch (error) {
            console.log('Create and Update Profile', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
