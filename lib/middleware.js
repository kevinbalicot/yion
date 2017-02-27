class Middleware {
    constructor (callback) {
        this.callback = callback;
    }

    process (req, res, next, ...args) {
        this.callback.call(this, req, res, next, ...args);
    }
}

module.exports = Middleware;
