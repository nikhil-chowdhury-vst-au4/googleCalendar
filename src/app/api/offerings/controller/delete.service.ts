const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OfferingsService from '../services/offerings.service';

export default class DeleteService extends MasterController {
    static doc() {
        return {
            tags: ['Offerings'],
            description: 'Delete services',
            summary: 'Delete services'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToPath(
            Joi.object().keys({
                id: Joi.number().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await OfferingsService.deleteService(
                this.data.id,
                this.req.user.id
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
