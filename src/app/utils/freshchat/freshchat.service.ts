const axios = require('axios').default;

class FreshChatService {
    feedParamsIntoTemplate = (
        template_name: string,
        params: { data: string }[]
    ) => {
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

    feedParamsIntoTemplateImage = (
        template_name: string,
        params: { data: string }[],
        image: string
    ) => {
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

    getRequestFreshChatRequest = (data: any, mobile: string) => {
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

    sendBookingConfirmationFreshchatServiceRequest = async (
        name: string,
        customerName: string,
        serviceTitle: string,
        slot: string,
        meetingLink: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplate('mp_confirmation', [
            { data: name },
            { data: customerName },
            { data: serviceTitle },
            { data: slot },
            { data: meetingLink }
        ]);

        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    sendSegment1FreshchatServiceRequest = async (
        name: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplateImage(
            'mp_productmarketing_segment1',
            [{ data: name }, { data: process.env.FE_INSTA_LEARN_DOMAIN }],
            'https://storage.googleapis.com/instalearn/2.jpg'
        );
        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    sendSegment2FreshchatServiceRequest = async (
        name: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplateImage(
            'mp_productmarketing_segment2',
            [
                { data: name },
                {
                    data: 'https://www.notion.so/MeetpRO-59ae247388ce4653808cf462cdfe817f?pvs=4'
                }
            ],
            'https://storage.googleapis.com/instalearn/3.jpg'
        );
        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    sendBookingReminderFreshchatServiceRequest = async (
        name: string,
        customerName: string,
        serviceTitle: string,
        slot: string,
        meetingLink: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplate('mp_reminder', [
            { data: name },
            { data: slot },
            { data: customerName },
            { data: serviceTitle },

            { data: meetingLink }
        ]);

        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    sendFeedBackLinkFreshchatServiceRequest = async (
        name: string,
        customerName: string,

        formLink: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplate(
            'mp_testimonial_mentee',
            [{ data: customerName }, { data: name }, { data: formLink }]
        );

        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    sendFeedBackSubmittedFreshchatServiceRequest = async (
        name: string,
        customerName: string,

        testimoniallink: string,
        mobile: string
    ) => {
        const messagePayload = this.feedParamsIntoTemplate(
            'mp_testimonial_mentor',
            [{ data: name }, { data: customerName }, { data: testimoniallink }]
        );

        const request = this.getRequestFreshChatRequest(messagePayload, mobile);
        return this.callfreshChat(request);
    };

    callfreshChat = async (options: any) => {
        try {
            const response = await axios.request(options);
            return response;
        } catch (err) {
            console.log(err);
        }
    };
}

export default new FreshChatService();
