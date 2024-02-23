const {parse} = require('node:url')

const compose = require('../src/compose')

class Route {

  /**
   * @param {string} method - the request method
   * @param {string} pattern - the route pattern
   * @param {Array<Middleware>} callbacks
   */
  constructor(method, pattern, callbacks) {
    this.method = method
    this.pattern = pattern
    this.callbacks = callbacks
  }

  /**
   * @param {string} url
   * @param {Request} req
   *
   * @return {boolean}
   */
  _validPattern(url, req) {
    const ignoredPrefix = ''
    const route = `^${this.pattern}$`
    const keys = this.pattern.match(/{(\w+)}/g) || []
    const parsedUrl = parse(url, true)

    let cleanPattern = route.replace(/\//g, '\\/')
    cleanPattern = cleanPattern.replace(/{(\w+)}/g, '((?:(?!\\/)[\\W\\w_])+)')

    const regexp = new RegExp(cleanPattern, 'g')
    const values = regexp.exec(parsedUrl.pathname.replace(ignoredPrefix, ''))

    req.query = parsedUrl.query

    if (!!values) {
      req.params = {}
      keys.forEach((key, index) => {
        key = key.replace(/{(.+)}/g, '$1').trim()
        req.params[key] = values[index + 1] || null
      });

      return true
    }

    return false
  }

  /**
   * @param {Object} context
   * @param {function} next
   * @param {array} [args]
   */
  process(context, next, ...args) {
    const {req, res} = context
    if (req.method === this.method && this._validPattern(req.uri, req)) {
      res.routeMatched = this
      compose(this.callbacks, context)(...args)
    } else {
      next(...args)
    }
  }
}

module.exports = Route
