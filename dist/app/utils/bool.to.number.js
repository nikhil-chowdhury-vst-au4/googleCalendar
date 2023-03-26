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
exports.boolToNumber = void 0;
function boolToNumber(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const prop in obj) {
            if (typeof obj[prop] === 'boolean') {
                obj[prop] = obj[prop] ? 1 : 0;
            }
            else if (typeof obj[prop] === 'object' &&
                obj[prop] !== null &&
                !(obj[prop] instanceof Date)) {
                yield boolToNumber(obj[prop]);
            }
        }
        return obj;
    });
}
exports.boolToNumber = boolToNumber;
//# sourceMappingURL=bool.to.number.js.map