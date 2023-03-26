"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class User extends common_1.default {
    static get PARENT_REMOVED() {
        return errorMessages_1.REMOVED_PARENT_SUCCESSFULLY;
    }
    static get UNABLE_TO_REMOVE_PARENT() {
        return errorMessages_1.UNABLE_TO_REMOVE_PARENT;
    }
}
exports.default = User;
//# sourceMappingURL=parent.js.map