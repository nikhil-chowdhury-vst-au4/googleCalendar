'use strict';

import isAuthenticated from '../../../middlewares/isAuthenticated';
import GetUser from '../../api/user/controller/get.profile';
import SetRules from '../../api/user/controller/set.availability';
import ModifyDates from '../../api/user/controller/modify.availabilityDates';
import SetConfiguration from '../../api/user/controller/update.availability.configuration';
import EditRules from '../../api/user/controller/update.availability';
import GetRules from '../../api/user/controller/get.availability';
import GetModifications from '../../api/user/controller/get.availability.modifications';
import CheckUsername from '../../api/user/controller/check.username';
import GetExpertiseAndServices from '../../api/user/controller/get.expertise';
import CreateOrUpdateProfile from '../../api/user/controller/create.profile';
import GetSlots from '../../api/user/controller/get.slots';
import GetCreatorDetails from '../../api/user/controller/get.creatorDetails';
import Delete from '../../api/user/controller/delete.user';
import AddBankDetails from '../../api/user/controller/add.bankDetails';
import UploadUserImage from '../../api/user/controller/upload.image';
import GetBankDetails from '../../api/user/controller/get.bankDetails';
import SendCreateOrUpdateProfile from '../../api/user/controller/send.creatorMarketing';
import GetBookingQuestions from '../../api/user/controller/get.bookingQuestions';
import GetCalendarDates from '../../api/user/controller/get.CalendarDates';

module.exports = function (app, path = '') {
    GetUser.get(app, path + '/user', [isAuthenticated]);
    GetRules.get(app, path + '/user/availibility/fetch', [isAuthenticated]);
    GetModifications.get(app, path + '/user/availibility/modifications', [
        isAuthenticated
    ]);
    SetRules.post(app, path + '/user/availibility/set', [isAuthenticated]);
    ModifyDates.post(app, path + '/user/availibility/modify', [
        isAuthenticated
    ]);
    SetConfiguration.put(app, path + '/user/availibility/configure', [
        isAuthenticated
    ]);
    EditRules.put(app, path + '/user/availibility/edit', [isAuthenticated]);
    CheckUsername.get(app, path + '/user/checkUsername', [isAuthenticated]);
    GetExpertiseAndServices.get(app, path + '/user/getServices', []);
    CreateOrUpdateProfile.put(app, path + '/user/update', [isAuthenticated]);
    GetSlots.get(app, path + '/user/slots', []);
    GetCreatorDetails.get(app, path + '/landingPageDetails');
    Delete.delete(app, path + '/user/delete/temporary');
    AddBankDetails.post(app, path + '/user/addBankDetails', [isAuthenticated]);
    UploadUserImage.post(app, path + '/uploadImage', [isAuthenticated]);
    GetBankDetails.get(app, path + '/user/bankdetails', [isAuthenticated]);
    SendCreateOrUpdateProfile.post(app, path + '/creator/messages', []);
    GetBookingQuestions.get(app, path + '/user/getBookingQuestions', []);
    GetCalendarDates.get(app, path + '/user/calendarDates', [isAuthenticated]);
};
