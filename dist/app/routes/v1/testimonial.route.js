'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const publish_testimonial_1 = require("../../api/testimonials/controller/publish.testimonial");
const isAuthenticated_1 = require("../../../middlewares/isAuthenticated");
const create_testimonial_1 = require("../../api/testimonials/controller/create.testimonial");
const get_testimonialData_1 = require("../../api/testimonials/controller/get.testimonialData");
const get_testimonial_1 = require("../../api/testimonials/controller/get.testimonial");
module.exports = function (app, path = '') {
    get_testimonialData_1.default.get(app, path + '/testimonial', []);
    get_testimonial_1.default.get(app, path + '/testimonial/details', [
        isAuthenticated_1.default
    ]);
    create_testimonial_1.default.post(app, path + '/testimonial/create', []);
    publish_testimonial_1.default.post(app, path + '/testimonial/publish', [
        isAuthenticated_1.default
    ]);
};
//# sourceMappingURL=testimonial.route.js.map