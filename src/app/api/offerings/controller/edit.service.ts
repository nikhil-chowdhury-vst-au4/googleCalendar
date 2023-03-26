const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OfferingsService from '../services/offerings.service';

export default class EditService extends MasterController {
    static doc() {
        return {
            tags: ['Offerings'],
            description: 'Edit existing services',
            summary: 'Edit existing services'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToPath(
            Joi.object().keys({
                id: Joi.number().required()
            })
        );
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().optional(),
                description: Joi.string().optional(),
                price: Joi.number().optional(),
                duration: Joi.number().optional(),
                questions: Joi.array().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await OfferingsService.editService(
                this.data,
                this.req.user.id
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
