const { ResponseBuilder } = require('base-packages');
import CommonService from '../../../utils/common.service';
import { SUCCESS_200 } from '../../../../config/constants/errorMessages';
import { sequelize } from '../../../../sequelize';
// import Payments from '../../../../models/payment';

class EarningsService extends CommonService {
    async getEarningDashboardDetails(userId: number, data: any) {
        try {
            const { startDate, endDate } = data;
            console.log(startDate, endDate, userId);
            let serviceEarnings,
                totalIncome = 0,
                totalPurchases = 0;
            if (!startDate || !endDate) {
                serviceEarnings = await sequelize.query(
                    {
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
					count(pt.id) as purchases, bd.serviceId, pt.sellerId, sd.title, MAX(pt.updatedAt) as updatedAt  FROM payments pt 
					INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
					INNER JOIN serviceDetails sd on sd.id = bd.serviceId
					WHERE pt.status = 'Success' AND pt.sellerId = ?
					GROUP BY bd.serviceId ORDER BY updatedAt DESC;`,
                        values: [userId]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
            } else {
                serviceEarnings = await sequelize.query(
                    {
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
					count(pt.id) as purchases, bd.serviceId, pt.sellerId, sd.title, MAX(pt.updatedAt) as updatedAt  FROM payments pt 
					INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
					INNER JOIN serviceDetails sd on sd.id = bd.serviceId
					WHERE pt.status = 'Success' AND pt.sellerId = ? AND (DATE(pt.createdAt) 
					BETWEEN ? AND ?)
					GROUP BY bd.serviceId ORDER BY updatedAt DESC;`,
                        values: [userId, startDate, endDate]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
            }
            serviceEarnings.forEach((service) => {
                totalIncome += service.totalIncome;
                totalPurchases += service.purchases;
            });
            return new ResponseBuilder(
                200,
                {
                    serviceEarnings,
                    totalIncome,
                    totalPurchases
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServiceEarnings(userId: number, data: any) {
        try {
            let { startDate, endDate, serviceId, limit, offset } = data;
            limit = Number(limit) || 10;
            offset = Number(offset) || 0;
            await console.log(startDate, endDate, serviceId, userId);
            let serviceEarnings, serviceUserDetails;
            if (!startDate || !endDate) {
                serviceEarnings = await sequelize.query(
                    {
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
				count(pt.id) as purchases, bd.serviceId, sd.title FROM payments pt 
				INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
				INNER JOIN serviceDetails sd on sd.id = bd.serviceId
				WHERE pt.status = 'Success' AND pt.sellerId = ? AND bd.serviceId = ?
				GROUP BY bd.serviceId;`,
                        values: [userId, serviceId]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
                serviceUserDetails = await sequelize.query(
                    {
                        query: `SELECT ROUND(SUM(pt.amount - pt.commission), 2) as income, pt.buyerId 
						,cs.name, cs.mobile , bd.bookingDate, pt.createdAt as purchaseDate FROM payments pt 
						INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
						INNER JOIN serviceDetails sd on sd.id = bd.serviceId
						INNER JOIN customer cs ON pt.buyerId = cs.id
						WHERE pt.status = 'Success' AND pt.sellerId = ?
						AND bd.serviceId = ?
						GROUP BY pt.id ORDER BY pt.createdAt DESC LIMIT ? OFFSET ?;
					   `,
                        values: [userId, serviceId, limit, offset]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
            } else {
                serviceEarnings = await sequelize.query(
                    {
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
				count(pt.id) as purchases, bd.serviceId, sd.title  FROM payments pt 
				INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
				INNER JOIN serviceDetails sd on sd.id = bd.serviceId
				WHERE pt.status = 'Success' AND pt.sellerId = ? AND (DATE(pt.createdAt) 
				BETWEEN ? AND ?)  AND bd.serviceId = ?
				GROUP BY bd.serviceId;`,
                        values: [userId, startDate, endDate, serviceId]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
                serviceUserDetails = await sequelize.query(
                    {
                        query: `SELECT ROUND(SUM(pt.amount - pt.commission), 2) as income, pt.buyerId ,cs.name,
						 cs.mobile , bd.bookingDate , pt.createdAt as purchaseDate FROM payments pt 
						INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
						INNER JOIN serviceDetails sd on sd.id = bd.serviceId
						INNER JOIN customer cs ON pt.buyerId = cs.id
						WHERE pt.status = 'Success' AND pt.sellerId = ? AND (DATE(pt.createdAt)
						 BETWEEN ? AND ?) AND bd.serviceId = ?
						GROUP BY pt.id ORDER BY pt.createdAt DESC LIMIT ? OFFSET ?;;`,
                        values: [
                            userId,
                            startDate,
                            endDate,
                            serviceId,
                            limit,
                            offset
                        ]
                    },
                    {
                        raw: true,
                        nest: true,
                        logging: true
                    }
                );
            }

            return new ResponseBuilder(
                200,
                {
                    serviceEarnings: serviceEarnings.length
                        ? serviceEarnings[0]
                        : {},
                    serviceUserDetails
                },
                SUCCESS_200
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default new EarningsService();
