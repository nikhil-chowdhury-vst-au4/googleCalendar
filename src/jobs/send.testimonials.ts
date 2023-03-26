const CronJob = require('cron').CronJob;
import bookingService from '../app/api/bookings/service/booking.service';

const craeteTestimonialLinkCron = new CronJob(
    '*/5 * * * *', // '* * * * * *',
    async function () {
        console.log('Create testimonial');
        try {
            await bookingService.getBookingsForTestimonial();
        } catch (e) {
            console.log(e);
        }
    },
    null,
    true,
    'Asia/Calcutta'
);

export default craeteTestimonialLinkCron;
