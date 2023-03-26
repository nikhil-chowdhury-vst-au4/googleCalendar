const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import EarningsService from '../services/earning.dashboard';

export default class GetUserEarnings extends MasterController {
    static doc() {
        return {
            tags: ['Earnings'],
            description: 'Get user Earning dashboard details',
            summary: 'Get user Earning dashboard details'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                startDate: Joi.string().optional(),
                endDate: Joi.string().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await EarningsService.getEarningDashboardDetails(
                this.req.user.id,
                this.data
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
