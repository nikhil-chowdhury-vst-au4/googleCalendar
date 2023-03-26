import CommonService from '../../../utils/common.service';
const { ResponseBuilder } = require('base-packages');
import {
    DATA_NOT_FOUND,
    SUCCESS_200
} from '../../../../config/constants/errorMessages';
import Testimonials from '../../../../models/testimonials';
import BookingDetails from '../../../../models/bookingDetails';
import Customer from '../../../../models/customer';
import ServiceDetails from '../../../../models/serviceDetails';
import Payments from '../../../../models/payment';
import User from '../../../../models/user';
import freshchatService from '../../../../app/utils/freshchat/freshchat.service';

class TestimonialService extends CommonService {
    async getTestimonialData(bookingId: string) {
        try {
            const id = await this.getBookingIdFromQuery(bookingId);

            const testimonial = await Testimonials.findOne({
                where: {
                    bookingId: id
                }
            });

            if (testimonial) {
                return new ResponseBuilder(
                    200,
                    {
                        alreadyfilled: true
                    },
                    SUCCESS_200
                );
            }

            const booking = await BookingDetails.findOne({
                where: {
                    id: id
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
                        attributes: ['id']
                    }
                ],
                attributes: [
                    'id',
                    'bookingDate',
                    'from',
                    'to',
                    'createdAt',
                    'sellerId'
                ]
            });
            const seller = await User.findOne({
                where: {
                    id: booking.sellerId
                },
                attributes: ['name', 'imageUrl', 'googleUrl', 'socialLinks']
            });
            console.log(id);
            return new ResponseBuilder(
                200,
                {
                    booking,
                    seller,
                    alreadyfilled: false
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async getTestimonialDetails(id: string, enc: number) {
        try {
            console.log(id);

            const testimonialId = enc
                ? await this.getBookingIdFromQuery(id)
                : id;

            const testimonial = await Testimonials.findByPk(testimonialId);

            if (!testimonial) {
                return new ResponseBuilder(404, {}, DATA_NOT_FOUND);
            }

            const booking = await BookingDetails.findOne({
                where: {
                    id: testimonial.bookingId
                },
                include: [
                    {
                        model: ServiceDetails,

                        attributes: ['title']
                    },
                    {
                        model: Payments,
                        include: [
                            {
                                model: Customer,
                                attributes: ['name']
                            }
                        ],
                        attributes: ['id']
                    }
                ],
                attributes: ['id']
            });
            if (!booking) {
                return new ResponseBuilder(404, {}, DATA_NOT_FOUND);
            }

            return new ResponseBuilder(
                200,
                {
                    rating: testimonial.rating,
                    isPublished: testimonial.isPublished,
                    customerName: booking.payment.customer.name,
                    serviceTitle: booking.service.title,
                    testimonial: testimonial.testimonial,
                    testimonialId: testimonial.id
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async createTestimonialData(data: any) {
        try {
            const { bookingId, sellerId, rating, testimonial, customerId } =
                data;

            const [seller, booking] = await Promise.all([
                User.findOne({
                    where: {
                        id: sellerId
                    },
                    attributes: ['rating', 'numRatings', 'mobile', 'name'],
                    raw: true
                }),
                BookingDetails.findOne({
                    where: {
                        id: bookingId
                    },
                    attributes: ['serviceId'],
                    include: [
                        {
                            model: Payments,
                            attributes: ['id'],
                            include: [
                                {
                                    model: Customer
                                }
                            ]
                        }
                    ]
                })
            ]);

            const newRating = Number(
                // eslint-disable-next-line prettier/prettier
                (
                    (seller.rating * seller.numRatings + rating) /
                    (seller.numRatings + 1)
                ).toFixed(1)
            );
            const [response] = await Promise.all([
                Testimonials.create({
                    bookingId: bookingId,
                    sellerId: sellerId,
                    rating: rating,
                    testimonial: testimonial,
                    customerId: customerId,
                    serviceId: booking.serviceId
                }),
                User.update(
                    {
                        rating: newRating,
                        numRatings: seller.numRatings + 1
                    },
                    {
                        where: {
                            id: sellerId
                        }
                    }
                )
            ]);

            const encodedLink = await this.createQueryFromBookingId(
                response.id
            );

            seller.mobile &&
                freshchatService.sendFeedBackSubmittedFreshchatServiceRequest(
                    seller.name,
                    booking.payment.customer.name,
                    process.env.FE_INSTA_LEARN_DOMAIN +
                        'calls?testimonialId=' +
                        encodedLink,
                    seller.mobile
                );

            return new ResponseBuilder(
                200,
                {
                    response
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async publishTestimonialData(publishFlag: boolean, testimonialId: number) {
        try {
            const testimonial = await Testimonials.update(
                {
                    isPublished: publishFlag
                },
                {
                    where: {
                        id: testimonialId
                    }
                }
            );
            return new ResponseBuilder(
                200,
                {
                    testimonial
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default new TestimonialService();
