const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import TestimonialService from '../services/testimonial.service';

export default class PublishTestimonialData extends MasterController {
    static doc() {
        return {
            tags: ['Testimonial'],
            description: 'Publish testimonial on creators page',
            summary: 'Publish testimonial on creators page'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                publish: Joi.boolean().required(),
                testimonialId: Joi.number().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await TestimonialService.publishTestimonialData(
                this.data.publish,
                this.data.testimonialId
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
