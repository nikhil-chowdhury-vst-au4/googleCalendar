require('./instana');

require('dotenv').config();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

// if (process.env.NODE_ENV === 'production') {
//     require('@instana/collector')();
// }

import { config } from './config/config';
globalThis.countryData = require('../countryData.json');
import ProcessMonitor from './processMonitor';
import nodeCache from './nodeCache';
import PubSubService from './app/consumers/gcp.pubsub.consumer';

// Init the express application
let app = require('./config/express')();
// Init base packages
require('./config/basePackages')();

// Init jobs
require('./jobs/index');

process.on('uncaughtException', function (err) {
    console.log('Process Error:', err);
});

PubSubService.pollForTopicMessages(process.env.PMS_SUBSCRIBTION);

// Start the app by listening on <port>
let server = app.get('server').listen(config.port);
server.keepAliveTimeout = 61 * 1000;
server.headersTimeout = 65 * 1000;

ProcessMonitor.start();
setInterval(function () {
    nodeCache.setUserBlockedNodeCache();
}, 300000);

console.log('Process alive ->', ProcessMonitor.isAlive());

// Expose app
exports = module.exports = app;

// require('../src/sequelize')();

// Logging initialization
console.log(
    `${config.app.title} started on ${config.hostname} : ${config.port} in ${
        process.env.NODE_ENV
    } mode on ${new Date().toISOString()}`
);
