"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationToGoogleChat = void 0;
const requestP = require('request-promise');
const sendNotificationToGoogleChat = (url, dataObj) => {
    try {
        console.log('sending alert message');
        const data = {
            text: `\`\`\`${JSON.stringify(dataObj)}\`\`\``
        };
        requestP({
            method: 'post',
            url: url,
            body: data,
            json: true
        });
    }
    catch (error) {
        console.error('error while sending notification to google chat', error);
    }
};
exports.sendNotificationToGoogleChat = sendNotificationToGoogleChat;
//# sourceMappingURL=alert.utils.js.map