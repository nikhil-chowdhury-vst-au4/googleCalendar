"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { MasterService } = require('base-packages');
const underscore_1 = require("underscore");
const tinyUrl = require('tinyurl');
const common_1 = require("../../config/constants/common");
class CommonService extends MasterService {
    checkIfNewBatchManagement(apiVersion) {
        return apiVersion > 7 ? 1 : 0;
    }
    getDate(date) {
        return date.getDate();
    }
    getMonth(date) {
        return date.getMonth() + 1;
    }
    getYear(date) {
        return date.getFullYear();
    }
    getDateMonthYearArray() {
        const date = new Date();
        return [this.getDate(date), this.getMonth(date), this.getYear(date)];
    }
    getRenderedSMSTemplate(tplContent, tplData) {
        for (let key in tplData) {
            if (tplData[key] &&
                typeof (tplData[key] == 'string') &&
                tplData[key].length > 30) {
                tplData[key] = tplData[key].substring(0, 28) + '..';
            }
        }
        const tpl = underscore_1.default.template(tplContent);
        const data = tpl(tplData);
        return data;
    }
    getTinyUrl(link) {
        try {
            return new Promise((resolve, reject) => {
                tinyUrl.shorten(link, function (res, err) {
                    if (err) {
                        console.error('Error in creating tiny link', err);
                        reject(err);
                    }
                    else {
                        resolve(res);
                    }
                });
            });
        }
        catch (err) {
            console.error('Error shortening link with Tiny', err);
        }
    }
    extensionMapping(extension) {
        const map = {
            'application/pdf': '.pdf',
            'image/png': '.png',
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg'
        };
        return map[extension];
    }
    getBookingIdFromQuery(query) {
        const length = query.length;
        const iterations = length / 3;
        let curr = 0, i = 0, res = '';
        while (i < iterations) {
            let split = query.slice(curr, curr + 3);
            console.log(i, iterations, split, common_1.default.hashToBookingIdMapping[split]);
            curr += 3;
            i++;
            res += common_1.default.hashToBookingIdMapping[split];
        }
        return Number(res);
    }
    createQueryFromBookingId(id) {
        let res = '';
        const toBeConverted = String(id);
        const length = toBeConverted.length;
        for (let i = 0; i < length; i++) {
            res += common_1.default.bookingIdToHashMapping[toBeConverted[i]];
        }
        return res;
    }
}
exports.default = CommonService;
//# sourceMappingURL=common.service.js.map