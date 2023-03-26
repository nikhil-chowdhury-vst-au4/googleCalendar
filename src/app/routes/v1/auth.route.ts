'use strict';

import AuthController from '../../api/auth/controller/auth.code';
// import MigrateAllBankDetails from '../../api/user/controller/migrate.bank.details';

module.exports = function (app, path = '') {
    AuthController.get(app, path + '/auth/token', []);
};
