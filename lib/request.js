const url = require('url');

class Request {
    constructor (req) {
        let parse = url.parse(req.url, true);
        this.url = req.url;
        this.uri = parse.pathname;
        this.method = req.method;
        this.headers = req.headers;
        this.userAgent = req.headers['user-agent'];
        this.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        this.orignal = req;
        this.params = {};
        this.body = {};
        this.query = parse.query;
    }
}

module.exports = Request;
