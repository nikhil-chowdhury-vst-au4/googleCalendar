const { MasterController, RequestBuilder, Joi } = require('base-packages');
import {
    INTERNAL_SERVER_ERROR,
    SUCCESS_200
} from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetBookingQuestions extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get Creator added Booking questions',
            summary: 'Get Creator added Booking questions'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                sellerId: Joi.string().required(),
                serviceId: Joi.string().required()
            })
        );

        return payload;
    }

    async controller() {
        try {
            const bookingQuestions = await UserService.bookingQuestions(
                this.data.sellerId,
                this.data.serviceId
            );
            return new this.ResponseBuilder(200, bookingQuestions, SUCCESS_200);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(400, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
