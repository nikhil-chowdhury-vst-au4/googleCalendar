"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const errorMessages_1 = require("./errorMessages");
class User extends common_1.default {
    static get UNABLE_TO_ADD_STUDENTS_OR_ORGANISATION_NOT_FOUND() {
        return errorMessages_1.UNABLE_TO_ADD_OR_ORG_NOT_FOUND;
    }
    static get SOME_STUDENTS_ADDED_SUCCESSFULLY() {
        return errorMessages_1.SOME_STUDENTS_ADDED;
    }
    static get STUDENTS_ADDED_SUCCESSFULLY() {
        return errorMessages_1.STUDENTS_ADDED;
    }
    static get PARENT_ALREADY_ADDED() {
        return errorMessages_1.PARENT_ALREADY_ADDED;
    }
}
exports.default = User;
//# sourceMappingURL=student.js.map