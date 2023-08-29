const compose = require('./compose');

const Middleware = require('./middleware');
const Route = require('./route');
const Link = require('./link');

class Group extends Middleware {
    constructor (prefix) {
        super((req, res) => compose(req, res, this.middlewares)());

        this.prefix = prefix;
        this.middlewares = [];
    }

    /**
     * Add middleware
     * @param {function} callback
     *
     * @return {Group}
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
     * @return {Group}
     */
    link(pattern, target, headers = {}) {
        this.middlewares.push(new Link(`${this.prefix}${pattern}`, target, headers));

        return this;
    }

    /**
     * Add GET listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     *
     * @return {Group}
     */
    get(pattern, callback) {
        this.middlewares.push(new Route(callback, `${this.prefix}${pattern}`, 'GET'));

        return this;
    }

    /**
     * Add POST listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     *
     * @return {Group}
     */
    post(pattern, callback) {
        this.middlewares.push(new Route(callback, `${this.prefix}${pattern}`, 'POST'));

        return this;
    }

    /**
     * Add DELETE listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     *
     * @return {Group}
     */
    delete(pattern, callback) {
        this.middlewares.push(new Route(callback, `${this.prefix}${pattern}`, 'DELETE'));
        return this;
    }

    /**
     * Add PUT listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     *
     * @return {Group}
     */
    put(pattern, callback) {
        this.middlewares.push(new Route(callback, `${this.prefix}${pattern}`, 'PUT'));

        return this;
    }

    /**
     * Add PATCH listener middleware
     * @param {string} pattern - the route pattern
     * @param {function} callback
     *
     * @return {Group}
     */
    patch(pattern, callback) {
        this.middlewares.push(new Route(callback, `${this.prefix}${pattern}`, 'PATCH'));

        return this;
    }

    /**
     * @param {string} url
     *
     * @return {boolean}
     */
    _validPattern(url) {
        url = decodeURI(url);

        const pattern = `^${this.prefix}/.*`;
        const regexp = new RegExp(pattern);

        return !!url.match(regexp);
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     * @param {array} [args]
     */
    process(req, res, next, ...args) {
        if (this._validPattern(req.uri)) {
            this.callback(req, res, next, ...args);
        } else {
            next(...args);
        }
    }
}

module.exports = Group;
