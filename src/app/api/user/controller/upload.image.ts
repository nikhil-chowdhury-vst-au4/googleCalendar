const { MasterController, RequestBuilder, Joi } = require('base-packages');
import UserService from '../services/user.service';

export default class UploadUserImage extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Upload user profile image',
            summary: 'upload user profile image'
        };
    }

    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                fileExtension: Joi.string().required()
            })
        );
        return payload;
    }

    async controller() {
        try {
            return await UserService.uploadImage(
                this.data.fileExtension,
                this.req.user.id
            );
        } catch (error) {
            console.log('Add creator bankDetails', error);
            return new this.ResponseBuilder(500, {}, error);
        }
    }
}
