const compose = require('./compose');

const Middleware = require('./middleware');
const Route = require('./route');
const Link = require('./link');

class Application {
    constructor () {
        this.middlewares = [];
    }

    use (callback) {
        this.middlewares.push(new Middleware(callback));
        return this;
    }

    link (pattern, target) {
        this.middlewares.push(new Link(pattern, target));
        return this;
    }

    get (pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'GET'));
        return this;
    }

    post (pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'POST'));
        return this;
    }

    delete (pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'DELETE'));
        return this;
    }

    put (pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'PUT'));
        return this;
    }

    patch (pattern, callback) {
        this.middlewares.push(new Route(callback, pattern, 'PATCH'));
        return this;
    }

    dispatch (req, res) {
        req.dispatching = true;
        compose(req, res, this.middlewares)();
    }
}

module.exports = Application;
