const Middleware = require('./middleware');

class Route extends Middleware {

    /**
     * @param {function} callback
     * @param {string} route - the route pattern
     * @param {string} [method='GET']
     * @param {string|null} [name=null]
     */
    constructor(callback, route, method = 'GET', name = null) {
        super(callback);

        this.route = route
        this.method = method;
        this.name = name;
    }

    /**
     * @param {string} url
     * @param {Request} req
     *
     * @return {boolean}
     */
    _validPattern(url, req) {
        url = decodeURI(url);

        const route = `^${this.route}\/?$`;
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
     * @param {function} next
     * @param {array} [args]
     */
    process(req, res, next, ...args) {
        if (req.method === this.method && this._validPattern(req.uri, req)) {
            res.routeMatched = this.route;
            this.callback(req, res, next, ...args);
        } else {
            next(...args);
        }
    }
}

module.exports = Route;
