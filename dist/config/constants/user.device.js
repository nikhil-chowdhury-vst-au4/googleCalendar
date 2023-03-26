"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class UserDevice extends common_1.default {
    static get DEFAULT_DELETED() {
        return errorMessages_1.DEVICE_REMOVED;
    }
}
exports.default = UserDevice;
//# sourceMappingURL=user.device.js.map