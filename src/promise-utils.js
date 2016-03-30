import log from "loglevel";
import Glance from "./glance";

Array.prototype.resolveSeries = function(func) {
    return this.reduce((p1, next)=> p1.then(() => func(next)), Promise.resolve());
};

Array.prototype.firstResolved = function(func) {
    return this.reduce((p1, next)=> p1.catch(() => func(next)), Promise.reject());
};

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

export default class PromiseUtils {
    constructor(promise, config) {
        this.promise = promise;
        this.config = config || {
                retryCount: 3,
                retryDelay: 500
            };
    }

    setPromise(promise) {
        this.promise = promise;
    }

    retryingPromise(func, attempt) {
        attempt = attempt || 1;

        return func().catch((reason) => {
            if (attempt <= this.config.retryCount) {
                let delayAmount = attempt * this.config.retryDelay;
                log.debug("Retrying with delay:", delayAmount)
                return delay(delayAmount).then(() => this.retryingPromise(func, ++attempt))
            }
            else {
                log.debug("Retries failed:", reason)
                throw new Error(reason);
            }
        });
    }

    waitForThen(glance, resolve, reject) {
        reject = reject || function (reason) {
                return Promise.reject(reason)
            };
        
        this.promise = this.promise.then((value)=> resolve.call(new Glance(glance), value), (reason)=>reject.call(new Glance(glance), reason));

        return glance;
    }

    waitForCatch(glance, reject) {
        this.promise = this.promise.catch((reason)=> reject.call(new Glance(glance), reason));
        return glance;
    }
}