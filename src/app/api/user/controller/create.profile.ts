const { MasterController, RequestBuilder, Joi } = require('base-packages');
import { INTERNAL_SERVER_ERROR } from '../../../../config/constants/errorMessages';
import UserService from '../services/user.service';

export default class CreateOrUpdateProfile extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Create and Update Profile',
            summary:
                'To be used for both in onbaording update user call and Normal Edit Screen'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                username: Joi.string().optional(),
                expertise: Joi.array().items(Joi.string().optional()),
                defaultServices: Joi.array()
                    .items(
                        Joi.object().keys({
                            title: Joi.string().required(),
                            description: Joi.string().required()
                        })
                    )
                    .optional(),
                mobile: Joi.string().optional().allow(''),
                name: Joi.string().optional(),
                imageUrl: Joi.string().optional(),
                about: Joi.string().optional().allow(''),
                socialLinks: Joi.array()
                    .items(
                        Joi.object().keys({
                            type: Joi.string(),
                            url: Joi.string().allow('')
                        })
                    )
                    .optional()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await UserService.createOrUpdateProfile(
                this.data,
                this.req.user.id
            );
        } catch (error) {
            console.log('Create and Update Profile', error);
            return new this.ResponseBuilder(500, {}, INTERNAL_SERVER_ERROR);
        }
    }
}
