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
        console.time('request-time');

        compose(req, res, this.middlewares)();
        if (!res.matched) res.status(404, 'Not found').send('Not found');
        if (!res.finished) res.original.end();

        console.log(`${new Date()} - ${req.ip} - ${req.method} ${req.url} => ${res.original.statusCode} : ${res.original.statusMessage}`);
        console.timeEnd('request-time');
    }
}

module.exports = Application;
