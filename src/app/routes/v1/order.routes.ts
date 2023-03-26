'use strict';

import OrderStatus from '../../api/orders/controller/oder.status';
import CreateOrder from '../../api/orders/controller/create.order';
import AddBookingAnswers from '../../api/orders/controller/add.bookingAnswers';

module.exports = function (app, path = '') {
    CreateOrder.post(app, path + '/order/create', []);
    OrderStatus.post(app, path + '/order/status', []);
    AddBookingAnswers.post(app, path + '/order/bookingAnswers', []);
};
