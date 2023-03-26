const CronJob = require('cron').CronJob;
import bookingService from '../app/api/bookings/service/booking.service';

const sendBookingReminderCron = new CronJob(
    '*/15 * * * *', // '* * * * * *',
    async function () {
        console.log('send reminder cron');
        try {
            await bookingService.sendReminderWAForBookings();
        } catch (e) {
            console.log(e);
        }
    },
    null,
    true,
    'Asia/Calcutta'
);

export default sendBookingReminderCron;
