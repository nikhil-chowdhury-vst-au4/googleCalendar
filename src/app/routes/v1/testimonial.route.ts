'use strict';
import PublishTestimonialData from '../../api/testimonials/controller/publish.testimonial';
import isAuthenticated from '../../../middlewares/isAuthenticated';
import CreateTestimonialForBooking from '../../api/testimonials/controller/create.testimonial';
import GetTestimonialData from '../../api/testimonials/controller/get.testimonialData';
import GetTestimonialDetails from '../../api/testimonials/controller/get.testimonial';

module.exports = function (app, path = '') {
    GetTestimonialData.get(app, path + '/testimonial', []);
    GetTestimonialDetails.get(app, path + '/testimonial/details', [
        isAuthenticated
    ]);
    CreateTestimonialForBooking.post(app, path + '/testimonial/create', []);
    PublishTestimonialData.post(app, path + '/testimonial/publish', [
        isAuthenticated
    ]);
};
