const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import TestimonialService from '../services/testimonial.service';

export default class GetTestimonialData extends MasterController {
    static doc() {
        return {
            tags: ['Testimonial'],
            description: 'Get testimonial details',
            summary: 'Get testimonial details by query'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                id: Joi.string().required(),
                enc: Joi.string().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await TestimonialService.getTestimonialDetails(
                this.data.id,
                parseInt(this.data.enc)
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
