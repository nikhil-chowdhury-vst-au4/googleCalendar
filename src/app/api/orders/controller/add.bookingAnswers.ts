const { MasterController, RequestBuilder, Joi } = require('base-packages');
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS_200
} from '../../../../config/constants/errorMessages';
import OrderService from '../services/order.service';

export default class AddBookingAnswers extends MasterController {
    static doc() {
        return {
            tags: ['Order'],
            description: 'Add answers to booking questions',
            summary: 'Add answers to booking questions'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        const answers = Joi.object().keys({
            id: Joi.number().required(),
            answer: Joi.string().optional().allow('', null).default(null),
            question: Joi.string().required()
        });
        payload.addToBody(
            Joi.object().keys({
                answers: Joi.array().items(answers).required(),
                bookingId: Joi.number().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const answers = await OrderService.addBookingAnswers(this.data);
            return new this.ResponseBuilder(200, answers, SUCCESS_200);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(400, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
