const fs = require('fs')
const Middleware = require('./middleware')

/**
 * Link module
 *
 * @example
 * const Link = require('yion/lib/link');
 *
 * const link = new Link('/js', __dirname + '/public/js');
 * [ ... ]
 * link.process(req, res);
 */
class Link extends Middleware {

  /**
   * @param {string} pattern - what you use into html file (into link or script tags)
   * @param {string} target - filepath where there are files
   * @param {Object} [headers={}] - add headers at response
   */
  constructor(pattern, target, headers = {}) {
    super(null)

    this.pattern = pattern
    this.target = target
    this.headers = headers
  }

  /**
   * @param {string} url
   *
   * @returns {string|null}
   */
  _validPattern(url) {
    const pattern = `^${this.pattern}([^\\?]+)`
    const regexp = new RegExp(pattern, 'i')
    const result = regexp.exec(url)

    if (!!result && fs.existsSync(this.target + result[1])) {
      return result[1]
    }

    return null
  }

  /**
   * @param {string|null} ext
   *
   * @return {string}
   */
  _getContentType(ext) {
    switch (ext) {
      case 'ogg':
        return 'application/ogg'
      case 'pdf':
        return 'application/pdf'
      case 'json':
        return 'application/json'
      case 'xml':
        return 'application/xml'
      case 'zip':
        return 'application/zip'
      case 'js':
        return 'application/javascript'

      case 'gif':
        return 'image/gif'
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'tiff':
        return 'image/tiff'
      case 'svg':
        return 'image/svg+xml'
      case 'ico':
        return 'image/x-icon'

      case 'css':
        return 'text/css'
      case 'csv':
        return 'text/csv'
      case 'html':
      case 'htm':
        return 'text/html'

      case 'mp3':
        return 'audio/mpeg'

      case 'mpg':
      case 'mpeg':
        return 'video/mpeg'
      case 'm4v':
      case 'm4a':
      case 'mp4':
        return 'video/mp4'
      case 'mov':
        return 'video/quicktime'
      case 'wmv':
        return 'video/x-ms-wmv'
      case 'avi':
        return 'video/x-msvideo'
      case 'flv':
        return 'video/x-flv'
      case 'webm':
        return 'video/webm'

      default:
        return 'text/plain'
    }
  }

  /**
   * @param {Object} context
   * @param {function} next
   * @param {array} [args]
   */
  process(context, next, ...args) {
    const { res } = context

    const url = decodeURI(req.url)
    let targetFile = this._validPattern(url)
    if (!!targetFile) {
      const stats = fs.statSync(this.target + targetFile)
      const ext = targetFile.split('.').pop()
      const file = fs.readFileSync(this.target + targetFile)

      res.set('Content-Length', stats.size)
      res.set('Content-Type', this._getContentType(ext || null))
      res.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(targetFile.replace('/', '')))

      for (let name in this.headers) {
        res.set(name, this.headers[name])
      }

      res.send(file, 'binary')
      res.matched = true
    } else {
      next(...args)
    }
  }
}

module.exports = Link
