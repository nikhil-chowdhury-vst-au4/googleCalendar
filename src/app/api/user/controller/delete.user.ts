const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class DeleteUserSlots extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'delete slots',
            summary: 'delete  slots'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                email: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await UserService.deleteUser(this.data.email);
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
