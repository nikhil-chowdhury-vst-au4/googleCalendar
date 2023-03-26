"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { MasterController, RequestBuilder, Joi } = require('base-packages');
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const user_service_1 = require("../services/user.service");
class CreateOrUpdateProfile extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Create and Update Profile',
            summary: 'To be used for both in onbaording update user call and Normal Edit Screen'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(Joi.object().keys({
            username: Joi.string().optional(),
            expertise: Joi.array().items(Joi.string().optional()),
            defaultServices: Joi.array()
                .items(Joi.object().keys({
                title: Joi.string().required(),
                description: Joi.string().required()
            }))
                .optional(),
            mobile: Joi.string().optional().allow(''),
            name: Joi.string().optional(),
            imageUrl: Joi.string().optional(),
            about: Joi.string().optional().allow(''),
            socialLinks: Joi.array()
                .items(Joi.object().keys({
                type: Joi.string(),
                url: Joi.string().allow('')
            }))
                .optional()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_service_1.default.createOrUpdateProfile(this.data, this.req.user.id);
            }
            catch (error) {
                console.log('Create and Update Profile', error);
                return new this.ResponseBuilder(500, {}, errorMessages_1.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = CreateOrUpdateProfile;
//# sourceMappingURL=create.profile.js.map