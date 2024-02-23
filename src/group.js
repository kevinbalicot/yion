const compose = require('./compose')

const Middleware = require('./middleware')
const Route = require('./route')
const Link = require('./link')

class Group extends Middleware {
  constructor(prefix) {
    super((context) => compose(this.middlewares, context)())

    this.prefix = prefix
    this.middlewares = []
  }

  /**
   * Add middleware
   * @param {function} callback
   *
   * @return {Group}
   */
  use(callback) {
    this.middlewares.push(new Middleware(callback))

    return this
  }

  /**
   * Add link middleware (useful for asset, like js and css files)
   * @param {string} pattern - what you use into html file (into link or script tags)
   * @param {string} target - filepath where there are files
   * @param {Object} [headers={}] - add headers at response
   *
   * @return {Group}
   */
  link(pattern, target, headers = {}) {
    this.middlewares.push(new Link(`${this.prefix}${pattern}`, target, headers))

    return this
  }

  /**
   * Add GET listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Group}
   */
  get(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('GET', `${this.prefix}${pattern}`, middlewares))

    return this
  }

  /**
   * Add POST listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Group}
   */
  post(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('POST', `${this.prefix}${pattern}`, middlewares))

    return this
  }

  /**
   * Add DELETE listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Group}
   */
  delete(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('DELETE', `${this.prefix}${pattern}`, middlewares))

    return this
  }

  /**
   * Add PUT listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Group}
   */
  put(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('PUT', `${this.prefix}${pattern}`, middlewares))

    return this
  }

  /**
   * Add PATCH listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Group}
   */
  patch(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('PATCH', `${this.prefix}${pattern}`, middlewares))

    return this
  }

  /**
   * @param {string} url
   *
   * @return {boolean}
   */
  _validPattern(url) {
    url = decodeURI(url)

    const pattern = `^${this.prefix}/.*`
    const regexp = new RegExp(pattern)

    return !!url.match(regexp)
  }

  /**
   * @param {Object} context
   * @param {Function} next
   * @param {Array} [args]
   */
  process(context, next, ...args) {
    if (this._validPattern(req.uri)) {
      this.callback(context, next, ...args)
    } else {
      next(...args)
    }
  }
}

module.exports = Group
