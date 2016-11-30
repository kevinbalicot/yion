class Middleware {
    constructor (callback) {
        this.callback = callback;
    }

    process (req, res, next) {
        this.callback.call(this, req, res, next);
    }
}

module.exports = Middleware;
