"use strict";

Array.prototype.resolveSeries = function (func) {
    return this.reduce(function (p1, next) {
        return p1.then(function () {
            return func(next);
        });
    }, Promise.resolve());
};

Array.prototype.firstResolved = function (func) {
    return this.reduce(function (p1, next) {
        return p1.catch(function () {
            return func(next);
        });
    }, Promise.reject());
};