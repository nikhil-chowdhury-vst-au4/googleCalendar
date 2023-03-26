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
class FlattenObj {
    flat(obj, flag) {
        return __awaiter(this, void 0, void 0, function* () {
            let newObj = {};
            for (const prop in obj) {
                if (typeof obj[prop] === 'object' &&
                    obj[prop] !== null &&
                    !Array.isArray(obj[prop]) &&
                    !(obj[prop] instanceof Date)) {
                    const tempObj = yield this.flat(obj[prop], flag);
                    newObj = Object.assign(Object.assign({}, newObj), tempObj);
                }
                else if (prop === 'id' && flag) {
                    delete obj[prop];
                }
                else {
                    if (prop === 'id') {
                        flag = true;
                    }
                    newObj[prop] = obj[prop];
                }
            }
            return newObj;
        });
    }
}
exports.default = new FlattenObj();
//# sourceMappingURL=flatten.obj.js.map