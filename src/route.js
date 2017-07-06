const Middleware = require('./middleware');

/**
 * Route module
 * @module Route
 */
class Route extends Middleware {

    /**
     * @extends Middleware
     * @param {Callable} callback
     * @param {string} route - the route pattern
     * @param {string} [method='GET']
     *
     * @alias module:Route
     */
    constructor(callback, route, method = 'GET') {
        super(callback);

        this.route = route
        this.method = method;
    }

    /**
     * @protected
     * @param {string} url
     * @param {Request} req
     *
     * @return {boolean}
     *
     * @alias module:Route
     */
    _validPattern(url, req) {
        const route = `^${this.route}$`;
        const keys = route.match(/:(\w+)\(.+\)|:(\w+)/g) || [];

        let pattern = route.replace(/\//g, '\\/');
        pattern = pattern.replace(/:\w+(\(.+\))/g, '$1');
        pattern = pattern.replace(/:(\w+)/g, '((?:(?!\\/)[\\W\\w_])+)');

        const regexp = new RegExp(pattern, 'g');
        const values = regexp.exec(url);

        let params = [];
        if (!!values) {
            keys.forEach((key, index) => {
                key = key.replace(/:(\w+)\(.+\)|:(\w+)/g, '$1$2').trim();
                req.params[key] = values[index + 1] || null;
            });

            return true;
        }

        return false;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Callback} next
     * @param {Array} [args]
     *
     * @alias module:Route
     */
    process(req, res, next, ...args) {
        if (req.method == this.method && this._validPattern(req.uri, req)) {
            res.routeMatched = this.route;
            this.callback(req, res, next, ...args);
        } else {
            next(...args);
        }
    }
}

module.exports = Route;
