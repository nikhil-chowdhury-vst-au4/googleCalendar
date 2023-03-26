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
const sequelize_1 = require("sequelize");
class SequelizeMapper {
    static map(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof arg == 'object') {
                if (arg == null) {
                    return arg;
                }
                else if (arg.hasOwnProperty('$col')) {
                    return sequelize_1.Sequelize.col(arg.$col[0]);
                }
                else if (arg.hasOwnProperty('$literal')) {
                    return sequelize_1.Sequelize.literal(arg.$literal[0]);
                }
                else if (arg.hasOwnProperty('$fn')) {
                    return sequelize_1.Sequelize.fn(arg.$fn[0], yield this.map(arg.$fn[1]));
                }
                else if (arg.hasOwnProperty('$where')) {
                    if (arg.$where.length == 2) {
                        return sequelize_1.Sequelize.where(yield this.map(arg.$where[0]), yield this.map(arg.$where[1]));
                    }
                    else if (arg.$where.length == 3) {
                        return sequelize_1.Sequelize.where(yield this.map(arg.$where[0]), yield this.map(arg.$where[1]), yield this.map(arg.$where[2]));
                    }
                }
                else if (arg.hasOwnProperty('$op')) {
                    return {
                        [sequelize_1.Op[arg.$op[0]]]: yield this.map(arg.$op[1])
                    };
                }
                else if (arg.hasOwnProperty('$match')) {
                    return arg.$match;
                }
                else {
                    if (Array.isArray(arg)) {
                        if (arg.length > 0 && typeof arg[0] != 'object') {
                            return arg;
                        }
                        else {
                            const res = [];
                            for (let i = 0; i < arg.length; i++) {
                                res.push(yield this.map(arg[i]));
                            }
                            return res;
                        }
                    }
                    else {
                        const obj = {};
                        for (const key in arg) {
                            obj[key] = yield this.map(arg[key]);
                        }
                        return obj;
                    }
                }
            }
            else if (typeof arg == 'string' || typeof arg == 'number') {
                return arg;
            }
        });
    }
    static project(projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const element of projection) {
                if (typeof element == 'string') {
                    result.push(element);
                }
                else if (Array.isArray(element) && element.length > 0) {
                    const tempResult = yield this.map(element[0]);
                    if (element.length == 1) {
                        result.push([tempResult]);
                    }
                    else if (element.length == 2) {
                        result.push([tempResult, element[1]]);
                    }
                }
            }
            return result;
        });
    }
    static filter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = {};
            for (const key in filter) {
                obj = Object.assign(Object.assign({}, obj), (yield this.map({
                    [key]: filter[key]
                })));
            }
            return obj;
        });
    }
}
exports.default = SequelizeMapper;
//# sourceMappingURL=sequelize.mapper.js.map