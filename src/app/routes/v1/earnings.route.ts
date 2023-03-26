import GetUserServiceEarnings from '../../api/earningDashboard/controller/get.service.earnings';
import isAuthenticated from '../../../middlewares/isAuthenticated';
import GetUserEarnings from '../../api/earningDashboard/controller/get.user.earnings';
module.exports = function (app, path = '') {
    GetUserEarnings.get(app, path + '/userEarnings', [isAuthenticated]);
    GetUserServiceEarnings.get(app, path + '/serviceEarnings', [
        isAuthenticated
    ]);
};
