const { MasterController, RequestBuilder, Joi } = require('base-packages');
import UserService from '../services/user.service';

export default class AddBankDetails extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Add Bank Details',
            summary: 'Use this to add bank details of creator'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                beneficiaryName: Joi.string().required(),
                accountNumber: Joi.string().required(),
                IFSC: Joi.string().required(),
                email: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await UserService.addBankDetails(
                this.data,
                this.req.user.id
            );
        } catch (error) {
            console.log('Add creator bankDetails', error);
            return new this.ResponseBuilder(500, {}, error);
        }
    }
}
