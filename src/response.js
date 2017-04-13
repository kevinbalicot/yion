const fs = require('fs');

/**
 * Response module
 * @module Response
 */
class Response {

    /**
     * @param {ClientResponse} res
     *
     * @alias module:Response
     */
    constructor(res) {
        this.original = res;
        this.routeMatched = null;
    }

    /**
     * Set response status code
     * @param {number|string} code
     * @param {string} [message=null]
     *
     * @return {Response}
     *
     * @alias module:Response
     */
    status(code, message = null) {
        this.original.statusCode = code;
        this.original.statusMessage = message;

        return this;
    }

    /**
     * Set response header
     * @param {string} key
     * @param {string} value
     *
     * @return {Response}
     *
     * @alias module:Response
     */
    set(key, value) {
        this.original.setHeader(key, value);

        return this;
    }

    /**
     * Write into response body
     * @param {string} message
     * @param {string} [encoding='utf-8']
     *
     * @return {Response}
     *
     * @alias module:Response
     */
    write(message, encoding = 'utf-8') {
        this.original.write(message, encoding);

        return this;
    }

    /**
     * Set response body and lock it
     * @param {*} data
     * @param {string} [encoding='utf-8']
     *
     * @alias module:Response
     */
    send(data = null, encoding = 'utf-8') {
        this.original.end(data, encoding);
    }

    /**
     * Attach file at response
     * @param {string} filepath
     * @param {string} filename
     * @param {string} [mimetype='text/plain']
     * @param {boolean} [attachment=true]
     *
     * @alias module:Response
     */
    sendFile(filepath, filename, mimetype = 'text/plain', attachment = true) {
        if (fs.existsSync(filepath)) {
            const fileStat = fs.statSync(filepath);
            this.set('Content-Type', mimetype);

            if (0 !== fileStat.size) {
                this.set('Content-Length', fileStat.size);
            }

            if (attachment) {
                this.set('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);
            }

            const readStream = fs.createReadStream(filepath);
            readStream.on('data', data => this.write(data));
            readStream.on('end', () => this.original.end());
        } else {
            throw new Error(`File ${filepath} doesn't exists.`);
        }
    }

    /**
     * Add json into response body
     * @param {Object|Array} data
     * @param {string} [encoding='utf-8']
     *
     * @alias module:Response
     */
    json(data, encoding = 'utf-8') {
        this.set('Content-Type', `application/json; charset=${encoding}`).send(JSON.stringify(data));
    }

    /**
     * Make response a redirection
     * @param {string} location
     * @param {number} [code=301]
     *
     * @alias module:Response
     */
    redirect(location, code = 301) {
        this.status(code).set('Location', location).send();
    }
}

module.exports = Response;
