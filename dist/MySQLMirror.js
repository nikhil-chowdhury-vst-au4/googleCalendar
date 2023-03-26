var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { fork } = require('child_process');
const mysql = require('mysql2/promise');
const requestP = require('request-promise');
exports = module.exports = class MySQLMirror {
    constructor(opts) {
        MySQLMirror._opts = JSON.parse(JSON.stringify(opts));
        delete MySQLMirror._opts.ssl;
        MySQLMirror._opts.host = 'gcp-mysql-db.classplus.co';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const child = fork(__filename, ['worker']);
            child.on('error', (err) => {
                console.log('ERROR IN MIRROR CHILD PROCESS');
            });
            child.send({ initOpts: MySQLMirror._opts });
            MySQLMirror.child = child;
        });
    }
    query(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                MySQLMirror.child.send(args);
            }
            catch (c) {
                console.log(c);
            }
        });
    }
};
class MirrorWorker {
    constructor() {
        console.log('MYSQL Mirror Worker Online');
        process.on('message', this.onMessage);
        MirrorWorker.lastErrorMessage = null;
    }
    static reportError(err, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield requestP({
                    method: 'POST',
                    url: 'https://skynet.classplusapp.com/report-mirror-error',
                    json: {
                        message: err.message,
                        args: args
                    }
                });
            }
            catch (c) {
                console.log('Unable to report error because ', c.message);
            }
        });
    }
    onMessage(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.initOpts) {
                MirrorWorker.opts = args.initOpts;
                MirrorWorker._pool = mysql.createPool(MirrorWorker.opts);
                return;
            }
            try {
                yield MirrorWorker._pool.query(...args);
                MirrorWorker.lastErrorMessage = null;
                process.stdout.write('.');
            }
            catch (c) {
                if (MirrorWorker.lastErrorMessage !== c.message) {
                    MirrorWorker.lastErrorMessage = c.message;
                    yield MirrorWorker.reportError(c, args);
                }
            }
        });
    }
}
if (process.argv[2] === 'worker') {
    new MirrorWorker();
    process.stdin.resume();
}
//# sourceMappingURL=MySQLMirror.js.map