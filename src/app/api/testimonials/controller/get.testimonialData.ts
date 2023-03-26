const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import TestimonialService from '../services/testimonial.service';

export default class GetTestimonialData extends MasterController {
    static doc() {
        return {
            tags: ['Testimonial'],
            description: 'Get testimonial data for booking',
            summary: 'Get testimonial data for booking'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                id: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await TestimonialService.getTestimonialData(this.data.id);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
