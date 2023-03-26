const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import BookingService from '../service/booking.service';
import { BOOKING_TYPE } from '../service/booking.service';

export default class GetUserRules extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description: 'Get Bookings',
            summary: 'Get Upcoming and Completed bookings'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                type: Joi.string().valid(
                    BOOKING_TYPE.completed,
                    BOOKING_TYPE.upcoming,
                    BOOKING_TYPE.today
                ),
                limit: Joi.number().integer().required().default(5),
                offset: Joi.number().integer().default(0)
            })
        );
        return payload;
    }

    async controller() {
        try {
            const result = await BookingService.getBookingsByQuery(
                this.data.type,
                this.data.user.id,
                this.data.limit,
                this.data.offset
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
