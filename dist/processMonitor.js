"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProcessMonitor {
    constructor() {
        this.alive = false;
        process.on('SIGTERM', () => {
            this.handleSigterm(this);
        });
    }
    isAlive() {
        return this.alive;
    }
    start() {
        console.info('Starting process monitor');
        this.alive = true;
    }
    handleSigterm(that) {
        console.info('SIGTERM signal received >>>>>');
        that.alive = false;
    }
}
exports.default = new ProcessMonitor();
//# sourceMappingURL=processMonitor.js.map