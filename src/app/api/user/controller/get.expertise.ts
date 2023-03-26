const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetExpertiseAndServices extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get Expertise and default services',
            summary: 'Get Expertise and default services'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            return await UserService.getExpertiseAndServices();
        } catch (error) {
            console.log('Get Expertise and default services', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
