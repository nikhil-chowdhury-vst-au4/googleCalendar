const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import BookingService from '../service/booking.service';

export default class GetBookingDetails extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description: 'Get Booking Details',
            summary: 'Get Booking Details By Id From Query'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                bookingId: Joi.number().integer().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await BookingService.getBookingById(
                parseInt(this.data.bookingId)
            );
            return new this.ResponseBuilder(
                result.statusCode,
                result.data,
                result.message
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
