"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
function createSignature() {
    try {
        let expectedSignature = `${process.env.PAYMENT_AUTH_KEY}|${process.env.PAYMENT_AUTH_SECRET}`;
        expectedSignature = crypto
            .createHmac('sha256', expectedSignature)
            .update(process.env.PAYMENT_AUTH_SALT)
            .digest('hex');
        return Buffer.from(`${expectedSignature} ${process.env.PAYMENT_CLIENT_NAME}`).toString('base64');
    }
    catch (e) {
        console.error(e);
        throw new Error('Error Generating PMS signature');
    }
}
exports.default = createSignature;
//# sourceMappingURL=generate.signature.js.map