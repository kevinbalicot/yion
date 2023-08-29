/**
 * Queue handler for middlewares
 *
 * @example
 * const compose = require('./compose');
 *
 * const middlewares = [() => {}, ...];
 *
 * compose(req, res, middlewares)();
 */

 /**
  * @param {Request} req
  * @param {Response} res
  * @param {Array<function>} middlewares
  *
  * @return {function} next
  */
module.exports = (req, res, middlewares) => {
    let next = () => res.status(404).send('Not found');
    let i = middlewares.length;

    while (i--) {
        next = middlewares[i].process.bind(middlewares[i], req, res, next);
    }

    return next;
};
