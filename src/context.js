class Context {
  constructor(req, res) {
    this.req = req
    this.res = res
  }

  get cookies() {
    return {
      get: (name) => {
        return this.req.cookies[name]
      },

      set: (name, value, options) => {
        this.res.setCookie(name, value, options)
      },

      delete: (name, options) => {
        this.res.deleteCookie(name, options)
      }
    }
  }

  set(key, value) {
    this[key] = value
  }
}

module.exports = Context