const {ServerResponse} = require('http')
const fs = require('fs')

/**
 * @param {ServerResponse} response
 */
module.exports = function (response) {
  Object.defineProperties(response, {
    routeMatched: {
      value: null,
      writable: true,
    },

    /**
     * Set response status code
     * @param {number|string} code
     * @param {string|null} [message=null]
     *
     * @return {Response}
     */
    status: {
      value: function (code, message = null) {
        this.statusCode = code
        this.statusMessage = message

        return this
      },
      writable: true,
    },

    /**
     * Set response header
     * @param {string} key
     * @param {string} value
     *
     * @return {Response}
     */
    set: {
      value: function (key, value) {
        if (typeof key === 'object') {
          for (const k in key) {
            this.setHeader(k, key[k])
          }

          return this
        }

        this.setHeader(key, value)

        return this
      },
      writable: true,
    },

    setCookie: {
      value: function (name, value, options = {
        maxAge: 0,
        expires: null,
        path: '/',
        domain: null,
        secure: true,
        httpOnly: true,
        sameSite: 'Lax'
      }) {
        let cookie = `${name}=${value}`

        if (options.maxAge) {
          cookie += `; Max-Age=${options.maxAge}`
        }

        if (options.expires) {
          cookie += `; Expires=${options.expires.toUTCString()}`
        }

        if (options.path) {
          cookie += `; Path=${options.path}`
        }

        if (options.domain) {
          cookie += `; Domain=${options.domain}`
        }

        if (options.secure) {
          cookie += `; Secure`
        }

        if (options.httpOnly) {
          cookie += `; HttpOnly`
        }

        if (options.sameSite) {
          cookie += `; SameSite=${options.sameSite}`
        }

        this.set('Set-Cookie', cookie)
      },
    },

    deleteCookie: {
      value: function (name, options = {}) {
        this.setCookie(name, '', {
          ...options,
          maxAge: -1,
          expires: new Date(0)
        })
      },
    },

    /**
     * Set response body and lock it
     * @param {*} data
     * @param {string} [encoding='utf-8']
     * @param {function|null} [callback=null]
     */
    send: {
      value: function (data = null, encoding = 'utf-8', callback = null) {
        this.end(data, encoding, callback)
      },
      writable: true,
    },

    /**
     * Attach file at response
     * @param {string} filepath
     * @param {string} filename
     * @param {string} [mimetype='text/plain']
     * @param {boolean} [attachment=true]
     * @param {function|null} [callback=null]
     */
    sendFile: {
      value: function (filepath, filename, mimetype = 'text/plain', attachment = true, callback = null) {
        if (fs.existsSync(filepath)) {
          const fileStat = fs.statSync(filepath)
          this.set('Content-Type', mimetype)

          if (0 !== fileStat.size) {
            this.set('Content-Length', fileStat.size)
          }

          if (attachment) {
            this.set('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`)
          }

          const readStream = fs.createReadStream(filepath)
          readStream.on('data', data => this.write(data))
          readStream.on('end', () => this.end(callback))
        } else {
          throw new Error(`File ${filepath} doesn't exists.`)
        }
      },
      writable: true,
    },

    /**
     * Add json into response body
     * @param {Object|Array} data
     * @param {string} [encoding='utf-8']
     * @param {function|null} [callback=null]
     */
    json: {
      value: function (data, encoding = 'utf-8', callback = null) {
        this
          .set('Content-Type', `application/json; charset=${encoding}`)
          .end(JSON.stringify(data), encoding, callback)
      },
      writable: true,
    },

    /**
     * Make response a redirection
     * @param {string} location
     * @param {number} [code=301]
     * @param {function|null} [callback=null]
     */
    redirect: {
      value: function (location, code = 301, callback = null) {
        this.status(code).set('Location', location).end(callback)
      },
      writable: true,
    }
  })

  return response
}
