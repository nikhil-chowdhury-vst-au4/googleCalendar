import { Op, Sequelize } from 'sequelize';
import CommonService from '../../../../app/utils/common.service';
import { SUCCESS_200 } from '../../../../config/constants/errorMessages';
import BookingDetails from '../../../../models/bookingDetails';
import Customer from '../../../../models/customer';
import ServiceDetails from '../../../../models/serviceDetails';

import * as moment from 'moment';
import Payments from '../../../../models/payment';
import User from '../../../../models/user';
import freshchatService from '../../../../app/utils/freshchat/freshchat.service';
import Testimonials from '../../../../models/testimonials';
import sendEmail from '../../../../app/utils/emailer';

export enum BOOKING_TYPE {
    upcoming = 'upcoming',
    completed = 'completed',
    today = 'today'
}

enum BOOKING_STATUS {
    booked = 'booked',
    pending = 'pending',
    cancelled = 'cancelled',
    failed = 'failed'
}

enum TESTIMONIAL_STATUS {
    pending = 'pending',
    sent = 'sent'
}

class BookingService extends CommonService {
    async getBookingsByQuery(
        type: BOOKING_TYPE,
        userId: number,
        limit: number,
        page: number
    ) {
        try {
            const filterMap = {
                upcoming: {
                    to: {
                        [Op.gt]: new Date()
                    }
                },
                completed: {
                    to: {
                        [Op.lte]: new Date()
                    }
                },
                today: {
                    to: {
                        [Op.lte]: moment().utc().endOf('day'),
                        [Op.gte]: moment().utc()
                    }
                }
            };
            const formatWhere = filterMap[type];
            // type == BOOKING_TYPE.upcoming
            //     ? {
            //           from: {
            //               [Op.gt]: moment().utcOffset(-330)
            //           }
            //       }
            //     : {
            //           from: {
            //               [Op.lte]: moment().utcOffset(-330)
            //           }
            //       };

            const orderBy =
                type == BOOKING_TYPE.upcoming || type == BOOKING_TYPE.today
                    ? 'ASC'
                    : 'DESC';

            const bookings = await BookingDetails.findAll({
                where: {
                    sellerId: userId,
                    status: BOOKING_STATUS.booked,
                    ...formatWhere
                },
                include: [
                    {
                        model: ServiceDetails,

                        attributes: ['id', 'duration', 'title', 'price']
                    },
                    {
                        model: Payments,
                        include: [
                            {
                                model: Customer
                            }
                        ],
                        attributes: ['id', 'amount']
                    },
                    {
                        model: Testimonials
                    }
                ],
                limit: Number(limit) || 5,
                offset: Number(page) || 0,
                order: [['to', orderBy]]
            });
            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: bookings
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    async getBookingsCount(userId: number) {
        try {
            const bookings = await BookingDetails.findAll({
                where: {
                    sellerId: userId,
                    status: BOOKING_STATUS.booked
                },
                attributes: [
                    [
                        Sequelize.literal(
                            'SUM(CASE WHEN `to`> now() THEN 1 ELSE 0 END)'
                        ),
                        BOOKING_TYPE.upcoming
                    ],
                    [
                        Sequelize.literal(
                            'SUM(CASE WHEN `to`<= now() THEN 1 ELSE 0 END)'
                        ),
                        BOOKING_TYPE.completed
                    ]
                ],
                raw: false
            });
            const result = {
                upcoming: bookings[0]['dataValues'][BOOKING_TYPE.upcoming] || 0,
                completed:
                    bookings[0]['dataValues'][BOOKING_TYPE.completed] || 0
            };
            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: result
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    async getBookingById(bookingId: number) {
        try {
            const booking = await BookingDetails.findByPk(bookingId, {
                include: [
                    {
                        model: ServiceDetails,

                        attributes: ['id', 'duration', 'title', 'price']
                    },
                    {
                        model: Payments,
                        include: [
                            {
                                model: Customer
                            }
                        ],
                        attributes: ['id', 'amount']
                    }
                ]
            });

            return {
                statusCode: 200,
                message: SUCCESS_200,
                data: booking
            };
        } catch (err) {
            throw new Error(err);
        }
    }

    async sendReminderWAForBookings() {
        try {
            // 			{{1}} : Name of Creator
            // {{2}}: Time of meeting
            // {{3}}: Name of end user
            // {{4}}: Offering Name
            // {{5}} : Meeting Link

            let checkTime = moment().add(15, 'minutes').startOf('minute');
            checkTime = checkTime.set({ seconds: 0 });
            const bookings = await BookingDetails.findAll({
                where: {
                    status: BOOKING_STATUS.booked,
                    from: checkTime
                },
                include: [
                    {
                        model: ServiceDetails,

                        attributes: ['id', 'duration', 'title', 'price'],
                        include: [
                            {
                                model: User,
                                attributes: ['name', 'mobile']
                            }
                        ]
                    },
                    {
                        model: Payments,
                        include: [
                            {
                                model: Customer
                            }
                        ],
                        attributes: ['id', 'amount']
                    }
                ],

                order: [['createdAt', 'ASC']]
            });
            console.log(bookings);
            for (let item of bookings) {
                if (item?.service?.creator?.mobile) {
                    const payload = {
                        name: item.service.creator.name,
                        customerName: item.payment.customer.name,
                        serviceTitle: item.service.title,
                        slot: moment(item.from)
                            .utcOffset(330)
                            .format('hh:mm A'),
                        meetingLink: item.meetingLink,
                        mobile: item.service.creator.mobile
                    };
                    freshchatService.sendBookingReminderFreshchatServiceRequest(
                        payload.name,
                        payload.customerName,
                        payload.serviceTitle,
                        payload.slot,
                        payload.meetingLink,
                        payload.mobile
                    );
                    freshchatService.sendBookingReminderFreshchatServiceRequest(
                        payload.customerName,
                        payload.name,
                        payload.serviceTitle,
                        payload.slot,
                        payload.meetingLink,
                        item.payment.customer.mobile
                    );
                }
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async getBookingsForTestimonial() {
        const currentTime = new Date();

        const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
        try {
            const bookings = await BookingDetails.findAll({
                where: {
                    status: BOOKING_STATUS.booked,
                    testimonialTrigger: TESTIMONIAL_STATUS.pending,
                    to: {
                        [Op.lte]: fiveMinutesAgo
                    },
                    bookingDate: {
                        [Op.gt]: moment('2023-03-15').toDate()
                    }
                },
                include: [
                    {
                        model: ServiceDetails,

                        attributes: ['id', 'duration', 'title', 'price'],
                        include: [{ model: User }]
                    },
                    {
                        model: Payments,
                        include: [
                            {
                                model: Customer
                            }
                        ],
                        attributes: ['id', 'amount']
                    }
                ],
                limit: 20,
                order: [['to', 'ASC']],
                raw: false
            });
            console.table(bookings);
            for (let item of bookings) {
                if (item?.payment?.customer) {
                    const encodedLink = await this.createQueryFromBookingId(
                        item.id
                    );

                    sendEmail(
                        [item.payment.customer.email],
                        'Share your session experience',
                        38,
                        {
                            meetProLink: 'http://meetpro.club',
                            date: moment(item.bookingDate).format(
                                'Do MMMM YYYY, dddd'
                            ),
                            time:
                                moment(item.from)
                                    .utcOffset(330)
                                    .format('hh:mm A') +
                                '-' +
                                moment(item.to)
                                    .utcOffset(330)
                                    .format('hh:mm A') +
                                ' (IST)',
                            mentorName: item.service.creator.name,
                            offeringName: item.service.title,
                            feedbackLink:
                                process.env.FE_INSTA_LEARN_DOMAIN +
                                '/feedback?testimonialId=' +
                                encodedLink
                        }
                    );

                    freshchatService.sendFeedBackLinkFreshchatServiceRequest(
                        item.service.creator.name,
                        item.payment.customer.name,
                        process.env.FE_INSTA_LEARN_DOMAIN +
                            '/feedback?testimonialId=' +
                            encodedLink,
                        item.payment.customer.mobile
                    );

                    // UPDATE STATUS IN BOOKINGS
                    await BookingDetails.update(
                        {
                            testimonialTrigger: TESTIMONIAL_STATUS.sent
                        },
                        {
                            where: {
                                id: item.id
                            }
                        }
                    );
                }
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}

export default new BookingService();
