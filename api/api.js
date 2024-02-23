const assert = require('node:assert')

const compose = require('../src/compose')

const Middleware = require('../src/middleware')
const Route = require('./route')
const Group = require('../src/group')
const wrapResponse = require('./response')
const validatePath = require('../middlewares/validate-path')
const validateQuery = require('../middlewares/validate-query')
const validateBody = require('../middlewares/validate-body')

const defaultGetPath = {
  responses: {
    200: {
      description: 'OK'
    }
  }
}

const defaultPostPath = {
  responses: {
    200: {
      description: 'OK'
    },
    201: {
      description: 'Created'
    },
    400: {
      description: 'Bad Request'
    },
    403: {
      description: 'Forbidden'
    },
    404: {
      description: 'Not Found'
    },
  }
}

const defaultDeletePath = {
  responses: {
    204: {
      description: 'Deleted'
    },
    403: {
      description: 'Forbidden'
    },
    404: {
      description: 'Not Found'
    },
  }
}

/**
 * Core API module of yion
 *
 * @example
 * const { createApi} = require('yion')
 *
 * const app = createApi()
 * app.get('/ping', {}, (req, res) => res.send({message: 'pong'}))
 */
class Api extends Middleware {
  constructor({ openapi = { info: {version: '1.0.0', title: 'Yion API'}} } = {}) {
    super(null)

    try {
      const SwaggerParser = require.main.require('@apidevtools/swagger-parser')
      this.apiValidator = new SwaggerParser()
    } catch (e) {
      throw new Error(`To use API application, install @apidevtools/swagger-parser lib : ${e.message}`)
    }

    this.middlewares = []
    this.openApi = {
      openapi: '3.0.3',
      ...openapi,
      paths: {},
      components: {
        securitySchemes: {},
        schemas: {}
      }
    }
  }

  addPath (path, options) {
    if (!this.openApi.paths[path]) {
      this.openApi.paths[path] = {}
    }

    const { method } = options
    assert.ok(method, 'Need method')

    delete options.method

    this.openApi.paths[path][method] = {
      ...options
    }

    this.apiValidator.validate(this.openApi, (err, api) => {
      if (err) {
        throw new Error(err)
      }
      this.openApi = api
    })
  }

  addSchemas (name, schemas) {
    this.openApi.components.schemas[name] = schemas
  }

  /**
   * Add middleware
   * @param {function} callback
   *
   * @return {Api}
   */
  use(callback) {
    this.middlewares.push(new Middleware(callback))

    return this
  }

  /**
   * Add GET listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  get(pattern, schemas, ...callbacks) {
    this.addPath(pattern, { method: 'get', ...defaultGetPath, ...schemas })
    const middlewares = [
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('GET', pattern, middlewares))

    return this
  }

  /**
   * Add POST listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  post(pattern, schemas, ...callbacks) {
    this.addPath(pattern, { method: 'post', ...defaultPostPath, ...schemas })
    const middlewares = [
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('POST', pattern, middlewares))

    return this
  }

  /**
   * Add DELETE listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  delete(pattern, schemas, ...callbacks) {
    this.addPath(pattern, { method: 'delete', ...defaultDeletePath, ...schemas })
    const middlewares = [
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('DELETE', pattern, middlewares))

    return this
  }

  /**
   * Add PUT listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  put(pattern, schemas, ...callbacks) {
    this.addPath(pattern, { method: 'put', ...defaultPostPath, ...schemas })
    const middlewares = [
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

    this.middlewares.push(new Route('PUT', pattern, middlewares))

    return this
  }

  /**
   * Add PATCH listener middleware
   * @param {string} pattern - the route pattern
   * @param {Object} schemas - the route schemas
   * @param {Function[]} callbacks
   *
   * @return {Api}
   */
  patch(pattern, schemas, ...callbacks) {
    this.addPath(pattern, { method: 'patch', ...defaultPostPath, ...schemas })
    const middlewares = [
      validatePath(schemas),
      validateQuery(schemas),
      validateBody(schemas),
      ...callbacks
    ].map(fct => new Middleware(fct))

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
    const {req, res} = context

    context.set('api', this)
    context.set('res', wrapResponse(res))

    req.dispatching = true
    try {
      compose(this.middlewares, context, next)(...args)
    } catch (e) {
      res.status(e.code || 500).send({error: e.message})
    }
  }
}

module.exports = Api
