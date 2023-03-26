const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetBankDetails extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get User bank details',
            summary: 'Get User bank details'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            return await UserService.getBankDetails(this.req.user.id);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(400, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
