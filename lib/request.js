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

    parseBody (chunk) {
        chunk = chunk.replace(/\+/g, '%20');
        let chunkSplit = decodeURIComponent(chunk).split('&');
        chunkSplit.forEach(c => {
            let k = c.split('=');
            this.body[k[0]] = k[1];
        });
    }
}

module.exports = Request;
