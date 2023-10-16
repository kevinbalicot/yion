const { IncomingMessage } = require('http');
const { parse } = require('url');

/**
 * @param {IncomingMessage} request
 */
module.exports = function (request) {
    const { query, pathname } = parse(request.url, true);

    Object.defineProperties(request, {
        params: {
            value: {},
            writable: true,
        },

        body: {
            value: '',
            writable: true,
        },

        attributes: {
            value: {},
            writable: true,
        },

        dispatching: {
            value: false,
            writable: true,
        },

        query: {
            value: query,
            writable: true,
        },

        uri: {
            value: pathname
        },

        ip: {
            get: function() {
                return this.headers['x-forwarded-for'] || this.connection.remoteAddress;
            }
        },

        userAgent: {
            get: function() {
                return this.headers['user-agent'];
            }
        },

        /**
         * Light body parser
         * @param {string} chunk
         */
        parseBody: {
            value: function(chunk) {
                if (this.headers['content-type'] && this.headers['content-type'].match(/application\/x-www-form-urlencoded/i)) {
                    if (typeof this.body === 'string') {
                        this.body = {};
                    }

                    let chunkSplit = chunk.split('&');

                    chunkSplit.forEach(c => {
                        let k = c.split('=');
                        this.body[k[0]] = k[1];
                    });
                } else if (this.headers['content-type'] && this.headers['content-type'].match(/application\/json/i)) {
                    try {
                        this.body = JSON.parse(chunk);
                    } catch (e) {
                        this.body += chunk;
                    }
                } else {
                    this.body += chunk;
                }
            },
            writable: true,
        },

        /**
         * Check if request has parameter or attribute
         * @param {string} key
         *
         * @return {boolean}
         */
        has: {
            value: function (key) {
                return !!this.params[key] || !!this.attributes[key] || !!this.headers[key];
            },
            writable: true,
        },

        /**
         * Get parameter or attribute if exists
         * @param {string} key
         *
         * @return {*}
         */
        get: {
            value: function (key) {
                if (!!this.params[key]) {
                    return this.params[key];
                }

                if (!!this.attributes[key]) {
                    return this.attributes[key];
                }

                if (!!this.headers[key]) {
                    return this.headers[key];
                }

                return null;
            },
            writable: true,
        }
    });

    return request;
};
