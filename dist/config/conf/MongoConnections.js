"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoConnections {
    static get connections() {
        return [
            {
                name: 'mongo1',
                mongoURL: 'mongodb://localhost:27017/boilerplate'
            }
        ];
    }
}
exports.default = MongoConnections;
//# sourceMappingURL=MongoConnections.js.map