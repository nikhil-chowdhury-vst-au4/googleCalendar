const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OfferingsService from '../services/offerings.service';

export default class GetAllServices extends MasterController {
    static doc() {
        return {
            tags: ['Offerings'],
            description: 'Get user services',
            summary: 'Get user services'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            return await OfferingsService.getAllOfferings(this.req.user.id);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
