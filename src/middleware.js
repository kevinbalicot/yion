/**
 * Middleware module
 * @module Middleware
 */
class Middleware {

    /**
     * @param {Callback} callback
     *
     * @alias module:Middleware
     */
    constructor(callback) {
        this.callback = callback;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Callback} next
     * @param {Array} [args]
     *
     * @alias module:Middleware
     */
    process(req, res, next, ...args) {
        this.callback.call(this, req, res, next, ...args);
    }
}

module.exports = Middleware;
