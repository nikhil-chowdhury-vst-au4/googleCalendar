"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./instana');
require('dotenv').config();
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}
const config_1 = require("./config/config");
globalThis.countryData = require('../countryData.json');
const processMonitor_1 = require("./processMonitor");
const nodeCache_1 = require("./nodeCache");
const gcp_pubsub_consumer_1 = require("./app/consumers/gcp.pubsub.consumer");
let app = require('./config/express')();
require('./config/basePackages')();
require('./jobs/index');
process.on('uncaughtException', function (err) {
    console.log('Process Error:', err);
});
gcp_pubsub_consumer_1.default.pollForTopicMessages(process.env.PMS_SUBSCRIBTION);
let server = app.get('server').listen(config_1.config.port);
server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 65 * 1000;
processMonitor_1.default.start();
setInterval(function () {
    nodeCache_1.default.setUserBlockedNodeCache();
}, 300000);
console.log('Process alive ->', processMonitor_1.default.isAlive());
exports = module.exports = app;
console.log(`${config_1.config.app.title} started on ${config_1.config.hostname} : ${config_1.config.port} in ${process.env.NODE_ENV} mode on ${new Date().toISOString()}`);
//# sourceMappingURL=server.js.map