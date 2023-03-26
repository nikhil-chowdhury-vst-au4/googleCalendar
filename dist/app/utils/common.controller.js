"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_const_1 = require("../../config/constants/common.const");
const { MasterController } = require('base-packages');
class CommonController extends MasterController {
    static get(router, path, middlewares) {
        super.get(router, path, middlewares);
    }
    static post(router, path, middlewares) {
        super.post(router, path, middlewares);
    }
    static patch(router, path, middlewares) {
        super.patch(router, path, middlewares);
    }
    static put(router, path, middlewares) {
        super.put(router, path, middlewares);
    }
    static delete(router, path, middlewares) {
        super.delete(router, path, middlewares);
    }
    isMobile() {
        return this.headers['user-agent'] !== common_const_1.userAgent.WEB;
    }
    isAndroid() {
        return this.headers['user-agent'] === common_const_1.userAgent.ANDROID;
    }
    isIos() {
        return this.headers['user-agent'] === common_const_1.userAgent.IOS;
    }
}
exports.default = CommonController;
//# sourceMappingURL=common.controller.js.map