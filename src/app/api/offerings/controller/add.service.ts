const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OfferingsService from '../services/offerings.service';

export default class AddService extends MasterController {
    static doc() {
        return {
            tags: ['Offerings'],
            description: 'Add new service',
            summary: 'Add new service'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().required(),
                description: Joi.string().required(),
                price: Joi.number().required(),
                duration: Joi.number().required(),
                questions: Joi.array().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await OfferingsService.addSevice(
                this.data,
                this.req.user.id
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
