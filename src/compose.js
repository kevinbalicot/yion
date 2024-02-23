/**
 * Queue handler for middlewares
 *
 * @example
 * const compose = require('./compose')
 *
 * const middlewares = [() => {}, ...]
 *
 * compose(req, res, middlewares)()
 */

 /**
  * @param {Array<Middleware>} middlewares
  * @param {Object} context
  * @param {Function|null} [next=null]
  *
  * @return {function} next
  */
module.exports = (middlewares, context, next = null) => {
    const {res} = context

    next = next ? next : () => {
        res.statusCode = 404
        res.statusMessage = 'Not Found'
        res.end('Not Found')
    }
    let i = middlewares.length

    while (i--) {
        next = middlewares[i].process.bind(middlewares[i], context, next)
    }

    return next
}