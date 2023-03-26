"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cockatiel_1 = require("cockatiel");
class CommonCircuitBreaker {
    constructor(policyArray) {
        this['policies'] = this.createPolicyObject(policyArray || []);
        this['defaultPauseTime'] = 10000;
        this['defaultConsecutiveBreaker'] = 3;
        this['defaultTimeout'] = 4000;
        this['defaultAttempts'] = 3;
        this['defaultDelay'] = 3000;
    }
    createPolicyObject(policyArray) {
        console.log('policyArray', policyArray);
        let policies = [];
        try {
            for (let policy of policyArray) {
                if (policy && policy.hasOwnProperty('name')) {
                    if (policy.name.toLowerCase() == 'circuitbreaker') {
                        if (policy.hasOwnProperty('pauseTime') &&
                            policy.hasOwnProperty('consecutiveBreaker')) {
                            policies.push(cockatiel_1.Policy.handleAll().circuitBreaker(policy.pauseTime, new cockatiel_1.ConsecutiveBreaker(policy.ConsecutiveBreaker)));
                        }
                        else {
                            throw new Error('Circuit Breaker have Invalid Fields');
                        }
                    }
                    if (policy && policy.name.toLowerCase() == 'timeout') {
                        if (policy.hasOwnProperty('timeout')) {
                            policies.push(cockatiel_1.Policy.timeout(policy.timeout, cockatiel_1.TimeoutStrategy.Aggressive));
                        }
                        else {
                            throw new Error('Timeout have Invalid Fields');
                        }
                    }
                    if (policy && policy.name.toLowerCase() == 'retry') {
                        if (policy.hasOwnProperty('attempts') &&
                            policy.hasOwnProperty('delay') ^
                                policy.hasOwnProperty('exponential')) {
                            if (policy.hasOwnProperty('delay')) {
                                policies.push(cockatiel_1.Policy.handleAll()
                                    .retry()
                                    .attempts(policy.attempts)
                                    .delay(policy.delay));
                            }
                            else if (policy.hasOwnProperty('exponential')) {
                                policies.push(cockatiel_1.Policy.handleAll()
                                    .retry()
                                    .attempts(policy.attempts)
                                    .exponential());
                            }
                        }
                        else {
                            throw new Error('Retry have Invalid Fields');
                        }
                    }
                }
            }
            return policies;
        }
        catch (error) {
            console.log('Error in createPolicyObject:- ', error);
        }
    }
    getCircuitBreaker() {
        if (!this['policies'].length) {
            return cockatiel_1.Policy.wrap(cockatiel_1.Policy.timeout(this['defaultTimeout'], cockatiel_1.TimeoutStrategy.Aggressive), cockatiel_1.Policy.handleAll()
                .retry()
                .attempts(this['defaultAttempts'])
                .delay(this['defaultDelay']), cockatiel_1.Policy.handleAll().circuitBreaker(this['defaultPauseTime'], new cockatiel_1.ConsecutiveBreaker(this['defaultConsecutiveBreaker'])));
        }
        this['policies'][0].onTimeout(() => {
            console.log('Timeout');
        });
        this['policies'][1].onRetry(() => {
            console.log('Retry');
        });
        return cockatiel_1.Policy.wrap.apply(null, this['policies']);
    }
}
exports.default = CommonCircuitBreaker;
//# sourceMappingURL=common.circuit.breaker.js.map