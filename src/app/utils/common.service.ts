const { MasterService } = require('base-packages');
import _ from 'underscore';
const tinyUrl = require('tinyurl');
import Common from '../../config/constants/common';
export default class CommonService extends MasterService {
    checkIfNewBatchManagement(apiVersion: number) {
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
            if (
                tplData[key] &&
                typeof (tplData[key] == 'string') &&
                tplData[key].length > 30
            ) {
                tplData[key] = tplData[key].substring(0, 28) + '..';
            }
        }
        const tpl = _.template(tplContent);
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
                    } else {
                        resolve(res);
                    }
                });
            });
        } catch (err) {
            console.error('Error shortening link with Tiny', err);
        }
    }

    extensionMapping(extension: string) {
        const map = {
            'application/pdf': '.pdf',
            'image/png': '.png',
            'image/jpeg': '.jpeg',
            'image/jpg': '.jpg'
        };

        return map[extension];
    }

    getBookingIdFromQuery(query: string) {
        const length = query.length;
        const iterations = length / 3;
        let curr = 0,
            i = 0,
            res = '';

        while (i < iterations) {
            let split = query.slice(curr, curr + 3);
            console.log(
                i,
                iterations,
                split,
                Common.hashToBookingIdMapping[split]
            );
            curr += 3;
            i++;
            res += Common.hashToBookingIdMapping[split];
        }
        return Number(res);
    }

    createQueryFromBookingId(id: number) {
        let res = '';
        const toBeConverted = String(id);
        const length = toBeConverted.length;

        for (let i = 0; i < length; i++) {
            res += Common.bookingIdToHashMapping[toBeConverted[i]];
        }
        return res;
    }
}
