const http = require('http')
const {Server} = require('http')

const compose = require('./compose')

const wrapRequest = require('./request')
const wrapResponse = require('./response')

const Context = require('./context')
const Application = require('./application')

/**
 * Yion module
 *
 * @example
 * const { createApp, createServer } = require('yion')
 *
 * const app = createApp()
 * const server = createServer(app)
 *
 * app.get('/', (req, res) => {
 *    res.set('Content-Type', 'text/html; charset=utf-8').send('Hello world!')
 * })
 *
 * server.listen(8080)
 */

const createApp = () => new Application()

/**
 * @param {Middleware[]} apps
 *
 * @return {Server}
 */
const createServer = (...apps) => {
  const server = http.createServer()

  server.on('request', (request, response) => {
    const req = wrapRequest(request)
    const res = wrapResponse(response)
    const context = new Context(req, res)

    try {
      compose(apps, context)()
    } catch (error) {
      response.statusCode = error.code || 500
      response.statusMessage = error.message || 'Internal Server Error'
      response.end(`${error.name} : ${error.message} \n ${error.stack}`)
    }
  })

  return server
}

module.exports = {createApp, createServer}
