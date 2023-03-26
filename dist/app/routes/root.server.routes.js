'use strict';
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
const health_utils_1 = require("../utils/health.utils");
const processMonitor_1 = require("../../processMonitor");
let glob = require('glob');
let path = require('path');
const statusMonitorConfig = JSON.parse(process.env.STATUS_MONITOR_CONFIG || '{}');
const statusMonitor = require('express-status-monitor')(statusMonitorConfig ? statusMonitorConfig : {});
module.exports = function (app) {
    app.use(statusMonitor);
    app.get('/health-check', function (req, res, next) {
        res.setHeader('Content-Security-Policy', "default-src *;style-src 'self' 'unsafe-inline'; script-src * 'self' 'unsafe-inline';connect-src * ;");
        next();
    }, statusMonitor.pageRoute);
    app.get('/health-check1', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('health-check1');
            res.json(yield (0, health_utils_1.healthCheck)());
        });
    });
    app.get('/', function (req, res) {
        res.render('index', {
            head: {
                title: 'INSTA LEARN'
            },
            content: {
                title: 'INSTA CONNECT!!',
                description: 'Welcome to CLASSPLUS INSTALEARN. This is preview page.'
            }
        });
    });
    app.use('/alive', function (req, res) {
        if (processMonitor_1.default.isAlive()) {
            return res.status(200).json({ data: { msg: 'Alive' } });
        }
        return res.status(500).json({ data: { msg: 'Dead' } });
    });
    const paths = ['/insta-learn'];
    glob.sync('./**/routes/v1/*.js').forEach(function (routePath) {
        for (let i = 0; i < paths.length; i++) {
            require(path.resolve(routePath))(app, paths[i]);
        }
    });
};
//# sourceMappingURL=root.server.routes.js.map