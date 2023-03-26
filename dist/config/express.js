'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_packages_1 = require("base-packages");
let fs = require('fs'), http = require('http'), https = require('https'), path = require('path');
let express = require('express'), bodyParser = require('body-parser'), methodOverride = require('method-override'), helmet = require('helmet'), mustacheExpress = require('mustache-express'), xss = require('xss-clean'), swaggerUi = require('swagger-ui-express'), glob = require('glob');
const swaggerDocument = require('./../../swagger.json');
const config_1 = require("./config");
const error_utils_1 = require("../app/utils/error.utils");
const compression = require("compression");
const cors = require("cors");
const sequelize_1 = require("../sequelize");
module.exports = function () {
    let app = express();
    app.use(compression());
    app.use((req, res, next) => {
        req.headers['accept-language'] = (req.headers['accept-language'] || 'en').toLowerCase();
        next();
    });
    (0, base_packages_1.initSwagger)(swaggerDocument);
    app.use(cors({
        origin: '*'
    }));
    app.locals.title = config_1.config.app.title;
    app.locals.description = config_1.config.app.description;
    app.use(function (req, res, next) {
        if (config_1.config.app.url) {
            app.locals.url = config_1.config.app.url + ':' + config_1.config.port;
        }
        else {
            res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        }
        next();
    });
    app.set('showStackError', true);
    app.engine('server.view.html', mustacheExpress());
    app.set('view engine', 'server.view.html');
    app.set('views', path.join(__dirname, '../app/views/'));
    if (process.env.NODE_ENV === 'development') {
        let morgan = require('morgan');
        app.use(morgan('dev'));
        app.set('view cache', false);
    }
    else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }
    else if (process.env.NODE_ENV === 'alpha') {
        app.locals.cache = 'memory';
    }
    else if (process.env.NODE_ENV === 'secure') {
        let morgan = require('morgan');
        app.use(morgan('dev'));
    }
    app.use(bodyParser.urlencoded({
        limit: '20mb',
        extended: false,
        parameterLimit: 20000
    }));
    app.use(bodyParser.json({ limit: '20mb' }));
    app.use(xss());
    app.use(methodOverride());
    app.use(helmet({
        frameguard: false
    }));
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.disable('x-powered-by');
    app.set('jsonp callback', true);
    glob.sync('./**/routes/*.js').forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
    app.use(express.static(path.join(__dirname, '../app/public')));
    if (config_1.config.toggle.apidoc) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup((0, base_packages_1.getFinalSwagger)()));
    }
    app.use(function (req, res) {
        (0, error_utils_1.log)('error', {
            message: 'Page Not Found - ' + req.url,
            payload: req.body || req.query
        });
        res.status(404).render(path.join(__dirname, '../app/views/error/404'), {
            head: {
                title: 'Page Not Found'
            },
            content: {
                title: 'OOPS!',
                description: 'Page Not Found. Error Code: 404'
            }
        });
    });
    let server;
    if (process.env.NODE_ENV === 'secure') {
        let privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        let certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');
        server = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);
    }
    else {
        server = http.createServer(app);
    }
    app.set('server', server);
    try {
        sequelize_1.sequelize
            .authenticate()
            .then(() => console.log('Connection has been established successfully.'));
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    delete Object.prototype.swaggerDocumentGlobal;
    return app;
};
//# sourceMappingURL=express.js.map