const jsonWriter = require('./json')
const textWriter = require('./text')
const JSON_MIMETYPE = 'application/json'

module.exports = {
  /**
   * Write data into Response
   *
   * @param {ServerResponse} res
   * @param {*} data
   * @param {string} [mimetype=application/json]
   * @param {number} [status=200]
   * @param {string|null} [statusMessage=null]
   */
  write(res, data, mimetype = JSON_MIMETYPE, status = 200, statusMessage = null) {
    res.statusCode = status
    if (statusMessage) {
      res.statusMessage = statusMessage
    }

    switch (mimetype) {
      case JSON_MIMETYPE:
        jsonWriter.write(res, data)
        break;
      default:
        textWriter.write(res, data)
    }
  },
}
