Array.prototype.resolveSeries = function(func) {
    return this.reduce((p1, next)=> p1.then(() => func(next)), Promise.resolve());
};

Array.prototype.firstResolved = function(func) {
    return this.reduce((p1, next)=> p1.catch(() => func(next)), Promise.reject());
};