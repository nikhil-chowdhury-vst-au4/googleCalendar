"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelizeRead = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const path = require("path");
let options = {};
options.database = process.env.SEQUELIZE_WRITE_DB_NAME;
options.models = [path.join(__dirname, '/modelsRead')];
options.logging = false;
options.dialect = 'mysql';
options.operatorsAliases = {
    $eq: sequelize_1.Op.eq,
    $ne: sequelize_1.Op.ne,
    $gte: sequelize_1.Op.gte,
    $gt: sequelize_1.Op.gt,
    $lte: sequelize_1.Op.lte,
    $lt: sequelize_1.Op.lt,
    $not: sequelize_1.Op.not,
    $in: sequelize_1.Op.in,
    $notIn: sequelize_1.Op.notIn,
    $is: sequelize_1.Op.is,
    $like: sequelize_1.Op.like,
    $notLike: sequelize_1.Op.notLike,
    $iLike: sequelize_1.Op.iLike,
    $notILike: sequelize_1.Op.notILike,
    $regexp: sequelize_1.Op.regexp,
    $notRegexp: sequelize_1.Op.notRegexp,
    $iRegexp: sequelize_1.Op.iRegexp,
    $notIRegexp: sequelize_1.Op.notIRegexp,
    $between: sequelize_1.Op.between,
    $notBetween: sequelize_1.Op.notBetween,
    $overlap: sequelize_1.Op.overlap,
    $contains: sequelize_1.Op.contains,
    $contained: sequelize_1.Op.contained,
    $adjacent: sequelize_1.Op.adjacent,
    $strictLeft: sequelize_1.Op.strictLeft,
    $strictRight: sequelize_1.Op.strictRight,
    $noExtendRight: sequelize_1.Op.noExtendRight,
    $noExtendLeft: sequelize_1.Op.noExtendLeft,
    $and: sequelize_1.Op.and,
    $or: sequelize_1.Op.or,
    $any: sequelize_1.Op.any,
    $all: sequelize_1.Op.all,
    $values: sequelize_1.Op.values,
    $col: sequelize_1.Op.col
};
if (process.env.NODE_ENV !== 'test') {
    options.dialect = 'mysql';
    options.dialectOptions = {
        ssl: false
    };
    options.port = Number(process.env.SEQUELIZE_WRITE_DB_PORT);
    options.logging = false;
    options.replication = {};
    let read = {};
    let write = {};
    options.replication.read = [read];
    options.replication.write = write;
    read.host = process.env.SEQUELIZE_READ_DB_HOST;
    read.username = process.env.REPLICA_USER;
    read.password = process.env.REPLICA_PWD;
    write.host = process.env.SEQUELIZE_WRITE_DB_HOST;
    write.username = process.env.REPLICA_USER;
    write.password = process.env.REPLICA_PWD;
    let pool = {};
    options.pool = pool;
    options.retry = {
        match: [
            /ETIMEDOUT/,
            /ECONNRESET/,
            /ECONNREFUSED/,
            /ESOCKETTIMEDOUT/,
            /EHOSTUNREACH/,
            /EPIPE/,
            /EAI_AGAIN/,
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
            /SequelizeConnectionAcquireTimeoutError/
        ],
        max: 3
    };
}
exports.sequelizeRead = new sequelize_typescript_1.Sequelize(process.env.SEQUELIZE_WRITE_DB_NAME, process.env.REPLICA_USER, process.env.REPLICA_PWD, Object.assign({}, options));
//# sourceMappingURL=sequelizeRead.js.map