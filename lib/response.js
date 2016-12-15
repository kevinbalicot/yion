const fs = require('fs');

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

    sendFile (filepath, filename, mimetype = 'text/plain', attachment = true) {
        if (fs.existsSync(filepath)) {
            const fileStat = fs.statSync(filepath);
            this.set('Content-Type', mimetype);

            if (0 !== fileStat.size) {
                this.set('Content-Length', fileStat.size);
            }

            if (attachment) {
                this.set('Content-Disposition', `attachment; filename=${filename}`);
            }

            const readStream = fs.createReadStream(filepath);
            readStream.on('data', data => {
                this.write(data);
            });
            readStream.on('end', () => {
                this.original.end();
            });
        } else {
            throw new Error(`File ${filepath} doesn't exists.`);
        }
    }

    json (data) {
        this.set('Content-Type', 'application/json').send(JSON.stringify(data));
    }

    redirect (location, code = 301) {
        this.status(code).set('Location', location).send();
    }
}

module.exports = Response;
