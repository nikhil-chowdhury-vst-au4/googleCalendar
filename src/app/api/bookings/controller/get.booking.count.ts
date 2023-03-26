const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import BookingService from '../service/booking.service';

export default class GetUserRules extends MasterController {
    static doc() {
        return {
            tags: ['Booking'],
            description: 'Get Bookings count',
            summary: 'Get Upcoming and Completed bookings count'
        };
    }

    static validate() {
        const payload = new RequestBuilder();

        return payload;
    }

    async controller() {
        try {
            const result = await BookingService.getBookingsCount(
                this.data.user.id
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
