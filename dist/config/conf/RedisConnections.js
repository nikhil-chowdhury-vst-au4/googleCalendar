"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisConnections {
    static get connections() {
        return [
            {
                name: process.env.REDIS_DB_NAME,
                redisURL: `redis://${process.env.REDIS_URL}`
            }
        ];
    }
}
exports.default = RedisConnections;
//# sourceMappingURL=RedisConnections.js.map