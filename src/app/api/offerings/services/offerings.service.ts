const { ResponseBuilder } = require('base-packages');
import CommonService from '../../../utils/common.service';
import { SUCCESS_200 } from '../../../../config/constants/errorMessages';
import ServiceDetails from '../../../../models/serviceDetails';
import BookingQuestions from '../../../../models/bookingQuestions';

class OfferingsService extends CommonService {
    async getAllOfferings(userId: number) {
        try {
            console.log(userId);
            const services = await ServiceDetails.findAll({
                where: {
                    userId: userId,
                    isActive: true
                },
                raw: true
                // include: [
                //     {
                //         model: BookingQuestions,
                //         where: {
                //             isDeleted: false
                //         },
                //         required: false,
                //         attributes: ['id', 'question']
                //     }
                // ]
            });

            const linkedin: any = {
                id: 0,
                question: 'Your LinkedIn URL?'
            };

            const servicesWithQuestions = await Promise.all(
                services.map(async (service) => {
                    const bookingQuestions = await BookingQuestions.findAll({
                        where: {
                            isDeleted: false,
                            sellerId: userId,
                            serviceId: service.id
                        },
                        attributes: ['id', 'question'],
                        raw: true
                    });
                    console.log(bookingQuestions);
                    bookingQuestions.unshift(linkedin);
                    return {
                        ...service,
                        questions: bookingQuestions
                    };
                })
            );
            console.log(servicesWithQuestions);

            return new ResponseBuilder(
                200,

                servicesWithQuestions,
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async addSevice(data: any, userId: number) {
        try {
            const service = await ServiceDetails.create({
                userId: userId,
                title: data.title,
                description: data.description,
                price: data.price,
                isFree: !(data.price > 0),
                serviceType: 'usergenerated',
                duration: data.duration
            });
            if (data.questions && data.questions.length) {
                await Promise.all(
                    data.questions.map((res) =>
                        BookingQuestions.create({
                            question: res.question,
                            serviceId: service.id,
                            sellerId: userId
                        })
                    )
                );
            }
            return new ResponseBuilder(
                200,
                {
                    service
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async editService(data: any, userId: number) {
        try {
            const service = await ServiceDetails.findOne({
                where: {
                    id: Number(data.id),
                    userId: userId
                }
            });
            if (!service) {
                return new ResponseBuilder(200, {}, 'Service not found');
            }

            const updateData = {
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...((data.price || data.price === 0) && { price: data.price }),
                ...((data.price || data.price === 0) && {
                    isFree: !(data.price > 0)
                }),
                ...(data.duration && { duration: data.duration })
            };

            const updatedService = await ServiceDetails.update(updateData, {
                where: {
                    id: Number(data.id)
                }
            });

            if (data.questions && data.questions.length) {
                await Promise.allSettled(
                    data.questions.map((question) => {
                        if (!question.id) {
                            return BookingQuestions.create(
                                {
                                    question: question.question,
                                    sellerId: userId,
                                    serviceId: data.id
                                },
                                {
                                    logging: true
                                }
                            );
                        }
                        if (question.id && question.isUpdated) {
                            return BookingQuestions.update(
                                {
                                    question: question.question
                                },
                                {
                                    where: { id: question.id },
                                    logging: true
                                }
                            );
                        }
                        if (question.id && question.isDeleted) {
                            return BookingQuestions.update(
                                {
                                    isDeleted: true
                                },
                                {
                                    where: {
                                        id: question.id
                                    },
                                    logging: true
                                }
                            );
                        }
                        return Promise.resolve(); // Skip iteration
                    })
                );
            }
            return new ResponseBuilder(
                200,
                {
                    updatedService
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteService(offeringId: number, userId: number) {
        try {
            const service = await ServiceDetails.update(
                {
                    isActive: false
                },
                {
                    where: {
                        id: offeringId,
                        userId: userId
                    }
                }
            );

            await BookingQuestions.destroy({
                where: {
                    serviceId: offeringId,
                    sellerId: userId
                }
            });
            return new ResponseBuilder(
                200,
                {
                    service
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new OfferingsService();
