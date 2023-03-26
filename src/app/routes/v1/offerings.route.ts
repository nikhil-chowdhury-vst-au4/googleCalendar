'use strict';
import DeleteService from '../../api/offerings/controller/delete.service';
import isAuthenticated from '../../../middlewares/isAuthenticated';
import AddService from '../../api/offerings/controller/add.service';
import GetAllServices from '../../api/offerings/controller/get.services';
import EditService from '../../api/offerings/controller/edit.service';

module.exports = function (app, path = '') {
    GetAllServices.get(app, path + '/services', [isAuthenticated]);
    AddService.post(app, path + '/service', [isAuthenticated]);
    EditService.put(app, path + '/services/:id', [isAuthenticated]);
    DeleteService.delete(app, path + '/services/:id', [isAuthenticated]);
};
