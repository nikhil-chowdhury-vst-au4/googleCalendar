"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_service_earnings_1 = require("../../api/earningDashboard/controller/get.service.earnings");
const isAuthenticated_1 = require("../../../middlewares/isAuthenticated");
const get_user_earnings_1 = require("../../api/earningDashboard/controller/get.user.earnings");
module.exports = function (app, path = '') {
    get_user_earnings_1.default.get(app, path + '/userEarnings', [isAuthenticated_1.default]);
    get_service_earnings_1.default.get(app, path + '/serviceEarnings', [
        isAuthenticated_1.default
    ]);
};
//# sourceMappingURL=earnings.route.js.map