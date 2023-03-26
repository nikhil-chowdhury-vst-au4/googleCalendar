const { PubSub } = require('@google-cloud/pubsub');
import OrderService from '../api/orders/services/order.service';

class PubSubService {
    private static __client: any;

    static get client() {
        if (!PubSubService.__client) {
            PubSubService.__client = new PubSub();
        }
        return PubSubService.__client;
    }

    static async sendMessage(payload, topicName, attributes: any) {
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
                messageId = await PubSubService.client
                    .topic(topicName, { enableMessageOrdering: true })
                    .publishMessage(message);
            } else {
                messageId = await PubSubService.client
                    .topic(topicName)
                    .publish(dataBuffer, attributes);
            }

            console.log(`Message ${messageId} published.`);
            return messageId;
        } catch (err) {
            console.error('PubSub SendMessage Error: ', err);
            return null;
        }
    }

    static pollForTopicMessages(subscriptionName) {
        try {
            console.debug(subscriptionName, '- listening');
            const subscription =
                PubSubService.client.subscription(subscriptionName);
            const messageHandler = async (message) => {
                console.log(
                    'subscriptionName',
                    subscriptionName,
                    message.attributes
                );
                console.log(`Received message ${message.id}:`);

                if (message.data) {
                    const paylaod = JSON.parse(message.data.toString());
                    await OrderService.giveAccessForPayment(paylaod);
                    message.ack();
                }

                console.log(`\tData: ${message.data.toString()}`);
            };
            const errorHandler = function (err) {
                console.log('Receive Error in pub sub', err);
            };
            subscription.on('message', messageHandler);
            subscription.on('error', errorHandler);
        } catch (err) {
            console.log('err', err);
        }
    }

    static subscribeToTopics() {
        if (process.env.IS_CONSUMER_ENABLED === 'true') {
            PubSubService.pollForTopicMessages(
                process.env.RAZORPAY_WEBHOOK_TOPIC_CONTENT_SUB
            );
        }
    }
}

export default PubSubService;
