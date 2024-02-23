const writer = require('./writers/writer')
const factory = require('./factory')

/**
 * @param {ServerResponse} res
 * @param {Object} [schemas={}]
 */
module.exports = function (res, schemas = {}) {
  Object.defineProperties(res, {
    /**
     * Generate response from route, status and mimetype
     * @param {*} [data=null]
     * @param {number} [status=200]
     * @param {string|null} [statusMessage=null]
     */
    send: {
      value: function (data = null, status = null, statusMessage = null) {
        const response = schemas.responses ? schemas.responses[status] : null
        const mimetype = 'application/json'

        let model = data;
        if (response && response.content) {
          //if (req.headers['accept'] && req.headers['accept'] !== '*/*') {
          //    mimetype = req.headers['accept'];
          //}

          //if (req.headers['accept'] && !response.content[mimetype]) {
          //    throw new BadRequestError('Not Acceptable', 406);
          //}

          const content = response.content[mimetype]
          if (content.schema.type === 'object') {
            model = factory.createFromModel(data, content.schema, true)
          } else if (content.schema.type === 'array' && Array.isArray(data)) {
            model = data.map(item => factory.createFromModel(item, content.schema.items, true))
          }
        }

        writer.write(res, model, mimetype, status || res.statusCode, statusMessage || res.statusMessage)

        res.end()
      }
    }
  })

  return res
}