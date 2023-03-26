'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticated_1 = require("../../../middlewares/isAuthenticated");
const get_booking_1 = require("../../api/bookings/controller/get.booking");
const get_booking_count_1 = require("../../api/bookings/controller/get.booking.count");
const get_booking_details_1 = require("../../api/bookings/controller/get.booking.details");
module.exports = function (app, path = '') {
    get_booking_1.default.get(app, path + '/bookings', [isAuthenticated_1.default]);
    get_booking_count_1.default.get(app, path + '/bookings/count', [isAuthenticated_1.default]);
    get_booking_details_1.default.get(app, path + '/bookings/details', [isAuthenticated_1.default]);
};
//# sourceMappingURL=booking.route.js.map