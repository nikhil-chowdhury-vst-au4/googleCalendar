'use strict';
import { healthCheck } from '../utils/health.utils';
import ProcessMonitor from '../../processMonitor';
let glob = require('glob');
let path = require('path');

const statusMonitorConfig = JSON.parse(
    process.env.STATUS_MONITOR_CONFIG || '{}'
);
const statusMonitor = require('express-status-monitor')(
    statusMonitorConfig ? statusMonitorConfig : {}
);
module.exports = function (app) {
    app.use(statusMonitor);
    app.get(
        '/health-check',
        function (req, res, next) {
            res.setHeader(
                'Content-Security-Policy',
                "default-src *;style-src 'self' 'unsafe-inline'; script-src * 'self' 'unsafe-inline';connect-src * ;"
            );
            next();
        },
        statusMonitor.pageRoute
    );
    app.get('/health-check1', async function (req, res) {
        console.log('health-check1');
        res.json(await healthCheck());
    });
    app.get('/', function (req, res) {
        res.render('index', {
            head: {
                title: 'INSTA LEARN'
            },
            content: {
                title: 'INSTA CONNECT!!',
                description:
                    'Welcome to CLASSPLUS INSTALEARN. This is preview page.'
            }
        });
    });

    app.use('/alive', function (req, res) {
        if (ProcessMonitor.isAlive()) {
            return res.status(200).json({ data: { msg: 'Alive' } });
        }
        return res.status(500).json({ data: { msg: 'Dead' } });
    });

    const paths = ['/insta-learn'];
    glob.sync('./**/routes/v1/*.js').forEach(function (routePath) {
        for (let i = 0; i < paths.length; i++) {
            require(path.resolve(routePath))(app, paths[i]);
        }
        // require(path.resolve(routePath))(app);
    });

    // Set params if needed
    // app.param('Id', apiCtrl.func);
};
