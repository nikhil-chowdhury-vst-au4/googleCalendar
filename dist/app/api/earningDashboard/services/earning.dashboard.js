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
const { ResponseBuilder } = require('base-packages');
const common_service_1 = require("../../../utils/common.service");
const errorMessages_1 = require("../../../../config/constants/errorMessages");
const sequelize_1 = require("../../../../sequelize");
class EarningsService extends common_service_1.default {
    getEarningDashboardDetails(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = data;
                console.log(startDate, endDate, userId);
                let serviceEarnings, totalIncome = 0, totalPurchases = 0;
                if (!startDate || !endDate) {
                    serviceEarnings = yield sequelize_1.sequelize.query({
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
					count(pt.id) as purchases, bd.serviceId, pt.sellerId, sd.title, MAX(pt.updatedAt) as updatedAt  FROM payments pt 
					INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
					INNER JOIN serviceDetails sd on sd.id = bd.serviceId
					WHERE pt.status = 'Success' AND pt.sellerId = ?
					GROUP BY bd.serviceId ORDER BY updatedAt DESC;`,
                        values: [userId]
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                }
                else {
                    serviceEarnings = yield sequelize_1.sequelize.query({
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
					count(pt.id) as purchases, bd.serviceId, pt.sellerId, sd.title, MAX(pt.updatedAt) as updatedAt  FROM payments pt 
					INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
					INNER JOIN serviceDetails sd on sd.id = bd.serviceId
					WHERE pt.status = 'Success' AND pt.sellerId = ? AND (DATE(pt.createdAt) 
					BETWEEN ? AND ?)
					GROUP BY bd.serviceId ORDER BY updatedAt DESC;`,
                        values: [userId, startDate, endDate]
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                }
                serviceEarnings.forEach((service) => {
                    totalIncome += service.totalIncome;
                    totalPurchases += service.purchases;
                });
                return new ResponseBuilder(200, {
                    serviceEarnings,
                    totalIncome,
                    totalPurchases
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getServiceEarnings(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { startDate, endDate, serviceId, limit, offset } = data;
                limit = Number(limit) || 10;
                offset = Number(offset) || 0;
                yield console.log(startDate, endDate, serviceId, userId);
                let serviceEarnings, serviceUserDetails;
                if (!startDate || !endDate) {
                    serviceEarnings = yield sequelize_1.sequelize.query({
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
				count(pt.id) as purchases, bd.serviceId, sd.title FROM payments pt 
				INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
				INNER JOIN serviceDetails sd on sd.id = bd.serviceId
				WHERE pt.status = 'Success' AND pt.sellerId = ? AND bd.serviceId = ?
				GROUP BY bd.serviceId;`,
                        values: [userId, serviceId]
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                    serviceUserDetails = yield sequelize_1.sequelize.query({
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
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                }
                else {
                    serviceEarnings = yield sequelize_1.sequelize.query({
                        query: ` SELECT ROUND(SUM(pt.amount - pt.commission), 2) as totalIncome, 
				count(pt.id) as purchases, bd.serviceId, sd.title  FROM payments pt 
				INNER JOIN bookingDetails bd ON bd.id = pt.bookingId
				INNER JOIN serviceDetails sd on sd.id = bd.serviceId
				WHERE pt.status = 'Success' AND pt.sellerId = ? AND (DATE(pt.createdAt) 
				BETWEEN ? AND ?)  AND bd.serviceId = ?
				GROUP BY bd.serviceId;`,
                        values: [userId, startDate, endDate, serviceId]
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                    serviceUserDetails = yield sequelize_1.sequelize.query({
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
                    }, {
                        raw: true,
                        nest: true,
                        logging: true
                    });
                }
                return new ResponseBuilder(200, {
                    serviceEarnings: serviceEarnings.length
                        ? serviceEarnings[0]
                        : {},
                    serviceUserDetails
                }, errorMessages_1.SUCCESS_200);
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.default = new EarningsService();
//# sourceMappingURL=earning.dashboard.js.map