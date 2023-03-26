'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const oder_status_1 = require("../../api/orders/controller/oder.status");
const create_order_1 = require("../../api/orders/controller/create.order");
const add_bookingAnswers_1 = require("../../api/orders/controller/add.bookingAnswers");
module.exports = function (app, path = '') {
    create_order_1.default.post(app, path + '/order/create', []);
    oder_status_1.default.post(app, path + '/order/status', []);
    add_bookingAnswers_1.default.post(app, path + '/order/bookingAnswers', []);
};
//# sourceMappingURL=order.routes.js.map