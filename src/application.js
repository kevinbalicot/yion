const compose = require('./compose');

const Middleware = require('./middleware');
const Route = require('./route');
const Link = require('./link');

/**
 * Core module of yion
 * @module Application
 * @example
 * const { createApp } = require('yion');
 *
 * const app = createApp();
 * app.get('/home', (req, res) => res.send('hello world'));
 */
class Application {
    constructor () {
        this.middlewares = [];
    }

    /**
     * Add middleware
     * @param {Callable} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    use(callback) {
        this.middlewares.push(new Middleware(callback));

        return this;
    }

    /**
     * Add link middleware (usefull for asset, like js and css files)
     * @param {string} pattern - what you use into html file (into link or script tags)
     * @param {string} target - filepath where there are files
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    link(pattern, target) {
        this.middlewares.push(new Link(pattern, target));

        return this;
    }

    /**
     * Add GET listener middleware
     * @param {string} pattern - the route pattern
     * @param {Callback} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    get(pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'GET'));

        return this;
    }

    /**
     * Add POST listener middleware
     * @param {string} pattern - the route pattern
     * @param {Callback} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    post(pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'POST'));

        return this;
    }

    /**
     * Add DELETE listener middleware
     * @param {string} pattern - the route pattern
     * @param {Callback} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    delete(pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'DELETE'));
        return this;
    }

    /**
     * Add PUT listener middleware
     * @param {string} pattern - the route pattern
     * @param {Callback} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    put(pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'PUT'));

        return this;
    }

    /**
     * Add PATCH listener middleware
     * @param {string} pattern - the route pattern
     * @param {Callback} callback
     *
     * @return {Application}
     *
     * @alias module:Application
     */
    patch(pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'PATCH'));

        return this;
    }

    /**
     * Dispatch a request to middlewares queue
     * @param {Request} req
     * @param {Response} res
     *
     * @alias module:Application
     */
    dispatch(req, res) {
        req.dispatching = true;
        compose(req, res, this.middlewares)();
    }
}

module.exports = Application;
