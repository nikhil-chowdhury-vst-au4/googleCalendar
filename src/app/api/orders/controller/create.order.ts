const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import OrderService from '../services/order.service';

export default class CreateOrder extends MasterController {
    static doc() {
        return {
            tags: ['Order'],
            description: 'Create new order',
            summary: 'Create new order'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                name: Joi.string(),
                mobile: Joi.string().required(),
                email: Joi.string().custom((value, helper) => {
                    if (
                        !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                            value
                        )
                    ) {
                        return helper.message('Please enter a valid email');
                    }

                    return true;
                }),

                query: Joi.string().optional().allow(''),
                sellerId: Joi.number().required(),
                serviceId: Joi.number().required(),
                bookingDate: Joi.string().required(),
                returnUrl: Joi.string().optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await OrderService.createOrder(this.data);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
