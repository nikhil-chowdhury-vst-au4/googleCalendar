"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const underscore_1 = require("underscore");
class CommonRepository {
    checkDefined(obj) {
        for (let key in obj) {
            if (!(obj[key] == undefined)) {
                if (typeof obj[key] == 'object' &&
                    !Array.isArray(obj[key]) &&
                    obj[key] != null &&
                    !(obj[key] instanceof Date)) {
                    return this.checkDefined(obj[key]);
                }
                return true;
            }
        }
        return false;
    }
    checkInclude(include, filterFlag) {
        if (include.length) {
            for (let i = 0; i < include.length; i++) {
                let currObject = include[i];
                if (!underscore_1.default.isEmpty(currObject)) {
                    if (currObject.include)
                        filterFlag = this.checkInclude(currObject.include, filterFlag);
                    if (!underscore_1.default.isEmpty(currObject.where) &&
                        this.checkDefined(currObject.where)) {
                        return true;
                    }
                }
            }
        }
        else {
            if (!underscore_1.default.isEmpty(include)) {
                if (include['include'] && !underscore_1.default.isEmpty(include['include']))
                    filterFlag = this.checkInclude(include['include'], filterFlag);
                if (include['where'] &&
                    !underscore_1.default.isEmpty(include['where']) &&
                    this.checkDefined(include['where'])) {
                    return true;
                }
            }
        }
        return filterFlag;
    }
    checkFilterAndInclude(filter = null, include = []) {
        if (underscore_1.default.isEmpty(filter) || !this.checkDefined(filter)) {
            return this.checkInclude(include, false);
        }
        else {
            return true;
        }
    }
    getFieldsFromDbResponse(dataRows, requiredFields) {
        const formattedResp = [];
        if (!dataRows ||
            !dataRows.length ||
            !requiredFields ||
            !requiredFields.length) {
            return formattedResp;
        }
        const fields = requiredFields.split(',');
        for (let row of dataRows) {
            const formattedRow = [];
            for (let field of fields) {
                if (!row.dataValues)
                    continue;
                formattedRow[field] = row.dataValues[field];
            }
            formattedResp.push(formattedRow);
        }
        if (fields.length === 1) {
            return underscore_1.default.pluck(formattedResp, fields[0]);
        }
        return formattedResp;
    }
}
exports.default = CommonRepository;
//# sourceMappingURL=common.repository.js.map