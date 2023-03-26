const { MasterController, RequestBuilder } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class GetCreatorDetails extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Get Creator Details for landing page',
            summary: 'Get Creator Details for landing page'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        return payload;
    }

    async controller() {
        try {
            const websiteUrl = this.req.headers['website-url'];
            console.log(websiteUrl);
            if (!websiteUrl) {
                return new this.ResponseBuilder(
                    400,
                    {},
                    'Something went wrong'
                );
            }

            return await UserService.getLandingPageDetails(websiteUrl);
        } catch (error) {
            console.log('error ::: ', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
