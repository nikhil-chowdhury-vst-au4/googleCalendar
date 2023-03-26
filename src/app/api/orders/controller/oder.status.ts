const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OrderService from '../services/order.service';

export default class OrderStatus extends MasterController {
    static doc() {
        return {
            tags: ['Order'],
            description: 'Get Order Status',
            summary: 'Get Order Status'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                orderId: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await OrderService.getOrderStatus(this.data.orderId);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
