const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class EditUserAvailabilityDates extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Modify Availability Dates',
            summary: 'Modify Availability Dates ex: block or override time'
        };
    }

    static validate() {
        const rules = Joi.object().keys({
            from: Joi.string().required(),
            to: Joi.string().required()
        });
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                date: Joi.string().required(),
                isActive: Joi.boolean().default(1),
                rules: Joi.array().items(rules).required()
            })
        );

        return payload;
    }

    async controller() {
        try {
            const result = await UserService.editAvailibilityDatesOfUser(
                this.data,
                this.req.user
            );
            return new this.ResponseBuilder(
                result.statusCode,
                {},
                result.message
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
