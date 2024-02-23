const compose = require('./compose')

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
    url = decodeURI(url)

    const route = `^${this.pattern}\/?$`
    const keys = route.match(/:(\w+)\(.+\)|:(\w+)/g) || []

    let pattern = route.replace(/\//g, '\\/')
    pattern = pattern.replace(/:\w+(\(.+\))/g, '$1')
    pattern = pattern.replace(/:(\w+)/g, '((?:(?!\\/)[\\W\\w_])+)')

    const regexp = new RegExp(pattern, 'g')
    const values = regexp.exec(url)

    let params = []
    if (!!values) {
      keys.forEach((key, index) => {
        key = key.replace(/:(\w+)\(.+\)|:(\w+)/g, '$1$2').trim()
        req.params[key] = values[index + 1] || null
      })

      return true
    }

    return false
  }

  generatePath(params = {}, query = {}) {
    let path = this.pattern

    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key])
    })

    if (Object.keys(query).length > 0) {
      path += '?'
      Object.keys(query).forEach(key => {
        path += `${key}=${query[key]}&`
      })
      path = path.substring(0, path.length - 1)
    }

    return path
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
