var jwt = require('jsonwebtoken');

const getPMSTokenForFrontend = async ({
    paymentSource = null,
    prefillData = null,
    gatewayOrderId = null,
    orderId = null,
    orgImageUrl = null,
    userId = null,
    returnUrl,
    gatewayCode = 'rzp'
}) => {
    try {
        // encrypt

        if (gatewayOrderId && orderId) {
            return jwt.sign(
                {
                    paymentSource,
                    gatewayCode,
                    prefillData,
                    gatewayOrderId,
                    orderId,
                    returnUrl,
                    orgImageUrl
                },
                process.env.PAYMENT_AUTH_SECRET,
                {
                    expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                    algorithm: process.env.ACCESS_TOKEN_ALGO
                }
            );
        } else {
            return jwt.sign(
                { returnUrl, orderId, gatewayCode },
                process.env.PAYMENT_AUTH_SECRET,
                {
                    expiresIn: process.env.TOKEN_EXPIRY_DURATION,
                    algorithm: process.env.ACCESS_TOKEN_ALGO
                }
            );
        }
    } catch (err) {
        console.log('\n\nSomething is wrong with hash provided.\n\n', err);
        return null;
    }
};

export default getPMSTokenForFrontend;
