const compose = require('./compose');

const Middleware = require('./middleware');
const Route = require('./route');
const Link = require('./link');
const Group = require("./group");

/**
 * Core module of yion
 *
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
     * @param {function} callback
     *
     * @return {Application}
     */
    use(callback) {
        this.middlewares.push(new Middleware(callback));

        return this;
    }

    /**
     * Add link middleware (useful for asset, like js and css files)
     * @param {string} pattern - what you use into html file (into link or script tags)
     * @param {string} target - filepath where there are files
     * @param {Object} [headers={}] - add headers at response
     *
     * @return {Application}
     */
    link(pattern, target, headers = {}) {
        this.middlewares.push(new Link(pattern, target, headers));

        return this;
    }

    /**
     * Add GET listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     * @param {string|null} [name=null]
     *
     * @return {Application}
     */
    get(pattern, callback, name = null) {
        this.middlewares.push(new Route(callback, pattern, 'GET', name));

        return this;
    }

    /**
     * Add POST listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     * @param {string|null} [name=null]
     *
     * @return {Application}
     */
    post(pattern, callback, name = null) {
        this.middlewares.push(new Route(callback, pattern, 'POST', name));

        return this;
    }

    /**
     * Add DELETE listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     * @param {string|null} [name=null]
     *
     * @return {Application}
     */
    delete(pattern, callback, name = null) {
        this.middlewares.push(new Route(callback, pattern, 'DELETE', name));
        return this;
    }

    /**
     * Add PUT listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     * @param {string|null} [name=null]
     *
     * @return {Application}
     */
    put(pattern, callback, name = null) {
        this.middlewares.push(new Route(callback, pattern, 'PUT', name));

        return this;
    }

    /**
     * Add PATCH listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     * @param {string|null} [name=null]
     *
     * @return {Application}
     */
    patch(pattern, callback, name = null) {
        this.middlewares.push(new Route(callback, pattern, 'PATCH', name));

        return this;
    }

    /**
     * Find route by name
     *
     * @param name
     *
     * @returns {Route|null}
     */
    findRoute(name) {
        return this.middlewares.find(middleware => middleware instanceof Route && middleware.name === name) || null;
    }

    /**
     * Add Group listener
     * @param {string} prefix - the route prefix
     *
     * @returns {Group}
     */
    group(prefix) {
        const group = new Group(prefix);
        this.middlewares.push(group);

        return group;
    }

    /**
     * Dispatch a request to middlewares queue
     * @param {Request} req
     * @param {Response} res
     */
    dispatch(req, res) {
        req.dispatching = true;
        compose(req, res, this.middlewares)();
    }
}

module.exports = Application;
