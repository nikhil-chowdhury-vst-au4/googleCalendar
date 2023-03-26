const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import TestimonialService from '../services/testimonial.service';

export default class CreateTestimonialForBooking extends MasterController {
    static doc() {
        return {
            tags: ['Testimonial'],
            description: 'Create testimonial for booking',
            summary: 'Create testimonial for booking'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                bookingId: Joi.number().required(),
                sellerId: Joi.number().required(),
                rating: Joi.number().required(),
                testimonial: Joi.string().required(),
                customerId: Joi.number().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await TestimonialService.createTestimonialData(this.data);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
