'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const auth_code_1 = require("../../api/auth/controller/auth.code");
module.exports = function (app, path = '') {
    auth_code_1.default.get(app, path + '/auth/token', []);
};
//# sourceMappingURL=auth.route.js.map