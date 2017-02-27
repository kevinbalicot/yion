const url = require('url');

class Request {
    constructor(req) {
        let parse = url.parse(req.url, true);
        this.url = req.url;
        this.uri = parse.pathname;
        this.method = req.method;
        this.headers = req.headers;
        this.userAgent = req.headers['user-agent'];
        this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        this.original = req;
        this.params = {};
        this.body = {};
        this.attributes = {};
        this.query = parse.query;
        this.dispatching = false;
    }

    parseBody(chunk) {
        let chunkSplit = chunk.split('&');
        chunkSplit.forEach(c => {
            let k = c.split('=');
            this.body[k[0]] = k[1];
        });
    }

    has(key) {
        return this.params[key] || this.attributes[key];
    }

    get(key) {
        if (!!this.params[key]) {
            return this.params[key];
        }

        if (!!this.attributes[key]) {
            return this.attributes[key];
        }

        return null;
    }
}

module.exports = Request;
