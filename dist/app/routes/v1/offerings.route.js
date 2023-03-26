'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const delete_service_1 = require("../../api/offerings/controller/delete.service");
const isAuthenticated_1 = require("../../../middlewares/isAuthenticated");
const add_service_1 = require("../../api/offerings/controller/add.service");
const get_services_1 = require("../../api/offerings/controller/get.services");
const edit_service_1 = require("../../api/offerings/controller/edit.service");
module.exports = function (app, path = '') {
    get_services_1.default.get(app, path + '/services', [isAuthenticated_1.default]);
    add_service_1.default.post(app, path + '/service', [isAuthenticated_1.default]);
    edit_service_1.default.put(app, path + '/services/:id', [isAuthenticated_1.default]);
    delete_service_1.default.delete(app, path + '/services/:id', [isAuthenticated_1.default]);
};
//# sourceMappingURL=offerings.route.js.map