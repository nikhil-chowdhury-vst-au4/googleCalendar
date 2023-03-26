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
const NodeCache = require('node-cache');
const nCache = new NodeCache({
    useClones: false
});
class nodeCache {
    setUserBlockedNodeCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const setResponse = 'as';
            return setResponse;
        });
    }
    getData(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return nCache.get(cacheKey);
        });
    }
    deleteAll(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return nCache.del(cacheKey);
        });
    }
}
exports.default = new nodeCache();
//# sourceMappingURL=nodeCache.js.map