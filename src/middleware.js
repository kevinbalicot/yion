class Middleware {
  /**
   * @param {Function} callback
   */
  constructor(callback) {
    this.callback = callback
  }

  /**
   * @param {Object} context
   * @param {Function} next
   * @param {Array} [args]
   */
  process(context, next, ...args) {
    this.callback.call(this, context, next, ...args)
  }
}

module.exports = Middleware
