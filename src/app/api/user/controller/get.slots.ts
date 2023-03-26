const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetUserSlots extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get slots',
            summary: 'Get  slots'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                userId: Joi.number().required(),
                serviceId: Joi.number().required(),
                lastDate: Joi.string().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await UserService.getUserSlots(
                this.data.userId,
                this.data.serviceId,
                this.data.lastDate
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
