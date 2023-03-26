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
const user_service_1 = require("../services/user.service");
class UploadUserImage extends MasterController {
    static doc() {
        return {
            tags: ['User'],
            description: 'Upload user profile image',
            summary: 'upload user profile image'
        };
    }
    static validate() {
        const payload = new RequestBuilder();
        payload.addToBody(Joi.object().keys({
            fileExtension: Joi.string().required()
        }));
        return payload;
    }
    controller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_service_1.default.uploadImage(this.data.fileExtension, this.req.user.id);
            }
            catch (error) {
                console.log('Add creator bankDetails', error);
                return new this.ResponseBuilder(500, {}, error);
            }
        });
    }
}
exports.default = UploadUserImage;
//# sourceMappingURL=upload.image.js.map