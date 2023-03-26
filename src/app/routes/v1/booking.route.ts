'use strict';

import isAuthenticated from '../../../middlewares/isAuthenticated';
import GetBookings from '../../api/bookings/controller/get.booking';
import GetBookingsCount from '../../api/bookings/controller/get.booking.count';
import GetBookingDetails from '../../api/bookings/controller/get.booking.details';

module.exports = function (app, path = '') {
    GetBookings.get(app, path + '/bookings', [isAuthenticated]);
    GetBookingsCount.get(app, path + '/bookings/count', [isAuthenticated]);
    GetBookingDetails.get(app, path + '/bookings/details', [isAuthenticated]);
};
