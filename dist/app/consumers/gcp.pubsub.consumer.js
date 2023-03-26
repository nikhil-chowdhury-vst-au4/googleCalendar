"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { PubSub } = require('@google-cloud/pubsub');
const order_service_1 = require("../api/orders/services/order.service");
class PubSubService {
    static get client() {
        if (!PubSubService.__client) {
            PubSubService.__client = new PubSub();
        }
        return PubSubService.__client;
    }
    static sendMessage(payload, topicName, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uuid } = payload;
                console.log('A-1', payload, attributes);
                const dataBuffer = Buffer.from(JSON.stringify(payload));
                let message = {
                    data: dataBuffer,
                    orderingKey: uuid
                };
                let messageId;
                if (uuid) {
                    messageId = yield PubSubService.client
                        .topic(topicName, { enableMessageOrdering: true })
                        .publishMessage(message);
                }
                else {
                    messageId = yield PubSubService.client
                        .topic(topicName)
                        .publish(dataBuffer, attributes);
                }
                console.log(`Message ${messageId} published.`);
                return messageId;
            }
            catch (err) {
                console.error('PubSub SendMessage Error: ', err);
                return null;
            }
        });
    }
    static pollForTopicMessages(subscriptionName) {
        try {
            console.debug(subscriptionName, '- listening');
            const subscription = PubSubService.client.subscription(subscriptionName);
            const messageHandler = (message) => __awaiter(this, void 0, void 0, function* () {
                console.log('subscriptionName', subscriptionName, message.attributes);
                console.log(`Received message ${message.id}:`);
                if (message.data) {
                    const paylaod = JSON.parse(message.data.toString());
                    yield order_service_1.default.giveAccessForPayment(paylaod);
                    message.ack();
                }
                console.log(`\tData: ${message.data.toString()}`);
            });
            const errorHandler = function (err) {
                console.log('Receive Error in pub sub', err);
            };
            subscription.on('message', messageHandler);
            subscription.on('error', errorHandler);
        }
        catch (err) {
            console.log('err', err);
        }
    }
    static subscribeToTopics() {
        if (process.env.IS_CONSUMER_ENABLED === 'true') {
            PubSubService.pollForTopicMessages(process.env.RAZORPAY_WEBHOOK_TOPIC_CONTENT_SUB);
        }
    }
}
exports.default = PubSubService;
//# sourceMappingURL=gcp.pubsub.consumer.js.map