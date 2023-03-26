"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateTimeByRegion = exports.dateType = void 0;
const countryData = globalThis.countryData;
const moment = require("moment-timezone");
exports.dateType = {
    EPOCH: 1,
    UTC: 2,
    IST: 3
};
const formatDateTimeByRegion = (date, region, type = 1, dateTimeFormatType = 1) => {
    let dateTimeStamp;
    let timeFormat;
    let timezoneTxt;
    if (typeof region === 'object') {
        dateTimeStamp = region['dateTimeStampBackend'];
        timeFormat = region['timeFormatBackend'];
        timezoneTxt = region.timezoneTxt;
    }
    else {
        dateTimeStamp =
            countryData[region]['dateTimeStampBackend'] ||
                countryData['default']['dateTimeStampBackend'];
        timeFormat =
            countryData[region]['timeFormatBackend'] ||
                countryData['default']['timeFormatBackend'];
        timezoneTxt =
            countryData[region].timezoneTxt ||
                countryData['default']['timezoneTxt'];
    }
    switch (dateTimeFormatType) {
        case 1:
            switch (type) {
                case exports.dateType.EPOCH:
                    return moment
                        .unix(date)
                        .format(`${dateTimeStamp} ${timeFormat}`);
                case exports.dateType.UTC:
                    return moment(date)
                        .tz(timezoneTxt)
                        .format(`${dateTimeStamp} ${timeFormat}`);
                case exports.dateType.IST:
                    return moment(date).format(`${dateTimeStamp} ${timeFormat}`);
            }
        case 2:
            switch (type) {
                case exports.dateType.EPOCH:
                    return moment.unix(date).format(`${timeFormat}`);
                case exports.dateType.UTC:
                    return moment(date).tz(timezoneTxt).format(`${timeFormat}`);
                case exports.dateType.IST:
                    return moment(date).format(`${timeFormat}`);
            }
        case 3:
            switch (type) {
                case exports.dateType.EPOCH:
                    return moment.unix(date).format(`${dateTimeStamp}`);
                case exports.dateType.UTC:
                    return moment(date)
                        .tz(timezoneTxt)
                        .format(`${dateTimeStamp}`);
                case exports.dateType.IST:
                    return moment(date).format(`${dateTimeStamp}`);
            }
    }
};
exports.formatDateTimeByRegion = formatDateTimeByRegion;
//# sourceMappingURL=format.date.time.js.map