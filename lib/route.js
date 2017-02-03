class Route {
    constructor (callback, route = null, method = 'GET') {
        this.callback = callback;
        this.route = route
        this.method = method;
    }

    _validPattern (url, req) {
        const route = `^${this.route}$`;
        const keys = route.match(/:(\w+)/g) || [];
        const pattern = route.replace(/:(\w+)/g, '(\\w+)');
        const regexp = new RegExp(pattern, 'g');
        const values = regexp.exec(url);

        let params = [];
        if (!!values) {
            keys.forEach((key, index) => {
                key = key.replace(':','');
                req.params[key] = values[index+1] || null;
            });
            return true;
        }
        return false;
    }

    process (req, res, next) {
        if (req.method == this.method && this._validPattern(req.uri, req)) {
            res.routeMatched = this.route;
            this.callback(req, res, next);
        } else {
            next();
        }
    }
}

module.exports = Route;
