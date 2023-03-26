const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetCalendarDates extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description:
                'Get all dates that are available for the next 2 months',
            summary: 'Get all dates that are available for the next 2 months'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            return await UserService.getBookingBlockedSlots(this.req.user.id);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(400, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
