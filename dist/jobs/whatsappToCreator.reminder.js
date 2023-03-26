"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CronJob = require('cron').CronJob;
const booking_service_1 = require("../app/api/bookings/service/booking.service");
const sendBookingReminderCron = new CronJob('*/15 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('send reminder cron');
        try {
            yield booking_service_1.default.sendReminderWAForBookings();
        }
        catch (e) {
            console.log(e);
        }
    });
}, null, true, 'Asia/Calcutta');
exports.default = sendBookingReminderCron;
//# sourceMappingURL=whatsappToCreator.reminder.js.map