const compose = require('./compose')

const Middleware = require('./middleware')
const Route = require('./route')
const Link = require('./link')
const Group = require("./group")

/**
 * Core module of yion
 *
 * @example
 * const { createApp } = require('yion')
 *
 * const app = createApp()
 * app.get('/home', (req, res) => res.send('hello world'))
 */
class Application extends Middleware {
  constructor() {
    super(null)
    this.middlewares = []
  }

  /**
   * Add middleware
   * @param {function} callback
   *
   * @return {Application}
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
   * @return {Application}
   */
  link(pattern, target, headers = {}) {
    this.middlewares.push(new Link(pattern, target, headers))

    return this
  }

  /**
   * Add GET listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Application}
   */
  get(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('GET', pattern, middlewares))

    return this
  }

  /**
   * Add POST listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Application}
   */
  post(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('POST', pattern, middlewares))

    return this
  }

  /**
   * Add DELETE listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Application}
   */
  delete(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('DELETE', pattern, middlewares))

    return this
  }

  /**
   * Add PUT listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Application}
   */
  put(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('PUT', pattern, middlewares))

    return this
  }

  /**
   * Add PATCH listener middleware
   * @param {string} pattern - the route pattern
   * @param {Function[]} callbacks
   *
   * @return {Application}
   */
  patch(pattern, ...callbacks) {
    const middlewares = callbacks.map(fct => new Middleware(fct))
    this.middlewares.push(new Route('PATCH', pattern, middlewares))

    return this
  }

  /**
   * Add Group listener
   * @param {string} prefix - the route prefix
   *
   * @returns {Group}
   */
  group(prefix) {
    const group = new Group(prefix)
    this.middlewares.push(group)

    return group
  }

  /**
   * @param {Object} context
   * @param {Function} next
   * @param {Array} [args]
   */
  process(context, next, ...args) {
    const {req} = context

    context.set('app', this)

    req.dispatching = true
    compose(this.middlewares, context, next)(...args)
  }
}

module.exports = Application
