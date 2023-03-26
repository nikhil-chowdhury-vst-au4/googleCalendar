const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class CheckUsername extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Check username for creating personalised URL',
            summary: 'Check username for creating personalised URL'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                username: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await UserService.checkUsername(this.data.username);
        } catch (error) {
            console.log('check username error', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
