class Response {
    constructor (res) {
        this.original = res;
        this.matched = false;
    }

    status (code, message = null) {
        this.original.statusCode = code;
        this.original.statusMessage = message;
        return this;
    }

    set (key, value) {
        this.original.setHeader(key, value);
        return this;
    }

    write (message, encoding = 'utf-8') {
        this.original.write(message, encoding);
        return this;
    }

    send (data = null, encoding = 'utf-8') {
        this.original.end(data, encoding);
    }

    json (data) {
        this.set('Content-Type', 'application/json').send(JSON.stringify(data));
    }

    redirect (location, code = 301) {
        this.status(code).set('Location', location).send();
    }
}

module.exports = Response;
