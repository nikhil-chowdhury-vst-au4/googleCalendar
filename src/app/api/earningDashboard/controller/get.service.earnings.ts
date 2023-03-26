const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import EarningsService from '../services/earning.dashboard';

export default class GetUserServiceEarnings extends MasterController {
    static doc() {
        return {
            tags: ['Earnings'],
            description: 'Get user Earning dashboard for particular Service',
            summary: 'Get user Earning dashboard for particular Service'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                startDate: Joi.string().optional(),
                endDate: Joi.string().optional(),
                serviceId: Joi.string().required(),
                limit: Joi.number().min(1).optional(),
                offset: Joi.number().min(0).optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await EarningsService.getServiceEarnings(
                this.req.user.id,
                this.data
            );
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
