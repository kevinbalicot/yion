class Middleware {

    /**
     * @param {function} callback
     */
    constructor(callback) {
        this.callback = callback;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     * @param {array} [args]
     */
    process(req, res, next, ...args) {
        this.callback.call(this, req, res, next, ...args);
    }
}

module.exports = Middleware;
