"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const pidusage = require('pidusage');
const os = require('os');
const healthCheck = () => {
    return new Promise((resolve, reject) => {
        pidusage(process.pid, (err, stat) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            stat.memory = stat.memory / 1024 / 1024;
            stat.load = os.loadavg();
            stat.timestamp = Date.now();
            resolve(stat);
        });
    });
};
exports.healthCheck = healthCheck;
//# sourceMappingURL=health.utils.js.map