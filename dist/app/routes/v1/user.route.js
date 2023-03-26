'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticated_1 = require("../../../middlewares/isAuthenticated");
const get_profile_1 = require("../../api/user/controller/get.profile");
const set_availability_1 = require("../../api/user/controller/set.availability");
const modify_availabilityDates_1 = require("../../api/user/controller/modify.availabilityDates");
const update_availability_configuration_1 = require("../../api/user/controller/update.availability.configuration");
const update_availability_1 = require("../../api/user/controller/update.availability");
const get_availability_1 = require("../../api/user/controller/get.availability");
const get_availability_modifications_1 = require("../../api/user/controller/get.availability.modifications");
const check_username_1 = require("../../api/user/controller/check.username");
const get_expertise_1 = require("../../api/user/controller/get.expertise");
const create_profile_1 = require("../../api/user/controller/create.profile");
const get_slots_1 = require("../../api/user/controller/get.slots");
const get_creatorDetails_1 = require("../../api/user/controller/get.creatorDetails");
const delete_user_1 = require("../../api/user/controller/delete.user");
const add_bankDetails_1 = require("../../api/user/controller/add.bankDetails");
const upload_image_1 = require("../../api/user/controller/upload.image");
const get_bankDetails_1 = require("../../api/user/controller/get.bankDetails");
const send_creatorMarketing_1 = require("../../api/user/controller/send.creatorMarketing");
const get_bookingQuestions_1 = require("../../api/user/controller/get.bookingQuestions");
const get_CalendarDates_1 = require("../../api/user/controller/get.CalendarDates");
module.exports = function (app, path = '') {
    get_profile_1.default.get(app, path + '/user', [isAuthenticated_1.default]);
    get_availability_1.default.get(app, path + '/user/availibility/fetch', [isAuthenticated_1.default]);
    get_availability_modifications_1.default.get(app, path + '/user/availibility/modifications', [
        isAuthenticated_1.default
    ]);
    set_availability_1.default.post(app, path + '/user/availibility/set', [isAuthenticated_1.default]);
    modify_availabilityDates_1.default.post(app, path + '/user/availibility/modify', [
        isAuthenticated_1.default
    ]);
    update_availability_configuration_1.default.put(app, path + '/user/availibility/configure', [
        isAuthenticated_1.default
    ]);
    update_availability_1.default.put(app, path + '/user/availibility/edit', [isAuthenticated_1.default]);
    check_username_1.default.get(app, path + '/user/checkUsername', [isAuthenticated_1.default]);
    get_expertise_1.default.get(app, path + '/user/getServices', []);
    create_profile_1.default.put(app, path + '/user/update', [isAuthenticated_1.default]);
    get_slots_1.default.get(app, path + '/user/slots', []);
    get_creatorDetails_1.default.get(app, path + '/landingPageDetails');
    delete_user_1.default.delete(app, path + '/user/delete/temporary');
    add_bankDetails_1.default.post(app, path + '/user/addBankDetails', [isAuthenticated_1.default]);
    upload_image_1.default.post(app, path + '/uploadImage', [isAuthenticated_1.default]);
    get_bankDetails_1.default.get(app, path + '/user/bankdetails', [isAuthenticated_1.default]);
    send_creatorMarketing_1.default.post(app, path + '/creator/messages', []);
    get_bookingQuestions_1.default.get(app, path + '/user/getBookingQuestions', []);
    get_CalendarDates_1.default.get(app, path + '/user/calendarDates', [isAuthenticated_1.default]);
};
//# sourceMappingURL=user.route.js.map