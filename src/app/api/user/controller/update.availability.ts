const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class EditUserAvailability extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Edit Rules',
            summary: 'Edit Rules'
        };
    }

    static validate() {
        const rules = Joi.object().keys({
            from: Joi.string().required(),
            to: Joi.string().required()
        });
        const availability = Joi.object().keys({
            id: Joi.number().integer().required(),
            day: Joi.number().integer().required(),
            isActive: Joi.boolean(),
            rules: Joi.array().items(rules).required()
        });
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                availability: Joi.array().items(availability).required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await UserService.editAvailibilityOfUser(
                this.data.availability,
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
