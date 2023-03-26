const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetUserDetails extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get User',
            summary: 'Get User'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            const result = await UserService.getUser(this.req.user);
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
