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
const axios = require('axios').default;
class FreshChatService {
    constructor() {
        this.feedParamsIntoTemplate = (template_name, params) => {
            return {
                message_template: {
                    storage: 'conversation',
                    template_name,
                    namespace: process.env.FRESHCHAT_NAMESPACE,
                    language: {
                        policy: 'deterministic',
                        code: 'en'
                    },
                    rich_template_data: {
                        body: {
                            params
                        }
                    }
                }
            };
        };
        this.feedParamsIntoTemplateImage = (template_name, params, image) => {
            return {
                message_template: {
                    storage: 'none',
                    template_name,
                    namespace: process.env.FRESHCHAT_NAMESPACE,
                    language: {
                        policy: 'deterministic',
                        code: 'en'
                    },
                    rich_template_data: {
                        header: {
                            type: 'image',
                            media_url: image
                        },
                        body: {
                            params
                        }
                    }
                }
            };
        };
        this.getRequestFreshChatRequest = (data, mobile) => {
            return {
                method: 'POST',
                url: `${process.env.FRESHCHAT_BASE_URL}/v2/outbound-messages/whatsapp`,
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.FRESHCHAT_AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    from: { phone_number: '+917669807164' },
                    provider: 'whatsapp',
                    to: [{ phone_number: `+91${mobile}` }],
                    data
                }
            };
        };
        this.sendBookingConfirmationFreshchatServiceRequest = (name, customerName, serviceTitle, slot, meetingLink, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplate('mp_confirmation', [
                { data: name },
                { data: customerName },
                { data: serviceTitle },
                { data: slot },
                { data: meetingLink }
            ]);
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.sendSegment1FreshchatServiceRequest = (name, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplateImage('mp_productmarketing_segment1', [{ data: name }, { data: process.env.FE_INSTA_LEARN_DOMAIN }], 'https://storage.googleapis.com/instalearn/2.jpg');
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.sendSegment2FreshchatServiceRequest = (name, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplateImage('mp_productmarketing_segment2', [
                { data: name },
                {
                    data: 'https://www.notion.so/MeetpRO-59ae247388ce4653808cf462cdfe817f?pvs=4'
                }
            ], 'https://storage.googleapis.com/instalearn/3.jpg');
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.sendBookingReminderFreshchatServiceRequest = (name, customerName, serviceTitle, slot, meetingLink, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplate('mp_reminder', [
                { data: name },
                { data: slot },
                { data: customerName },
                { data: serviceTitle },
                { data: meetingLink }
            ]);
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.sendFeedBackLinkFreshchatServiceRequest = (name, customerName, formLink, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplate('mp_testimonial_mentee', [{ data: customerName }, { data: name }, { data: formLink }]);
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.sendFeedBackSubmittedFreshchatServiceRequest = (name, customerName, testimoniallink, mobile) => __awaiter(this, void 0, void 0, function* () {
            const messagePayload = this.feedParamsIntoTemplate('mp_testimonial_mentor', [{ data: name }, { data: customerName }, { data: testimoniallink }]);
            const request = this.getRequestFreshChatRequest(messagePayload, mobile);
            return this.callfreshChat(request);
        });
        this.callfreshChat = (options) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.request(options);
                return response;
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = new FreshChatService();
//# sourceMappingURL=freshchat.service.js.map