const fs = require('node:fs')

let zlib
try {
  zlib = require.main.require('zlib')
} catch (e) {
  throw new Error(`To use encoding plugin, install zlib lib : ${e.message}`)
}

const hasAcceptedEncoding = (req, res) => {
  const encoding = res.getHeader('content-encoding')
  const acceptedEncoding = (req.headers['accept-encoding'] || '').split(', ')
  if (acceptedEncoding.includes(encoding)) {
    return encoding
  }

  return false
}

module.exports = () => (context, next) => {
  const {req, res} = context
  res.send = function (data = null, encoding = 'utf-8') {
    const acceptedEncoding = hasAcceptedEncoding(req, res)
    if (acceptedEncoding === 'gzip') {
      zlib.gzip(data, (err, data) => {
        if (err) {
          throw err
        }

        res.set('Content-Length', data.length)
        res.end(data)
      })
    } else {
      res.removeHeader('content-encoding')
      res.end(data, encoding)
    }
  }

  res.sendFile = function (filepath, filename, mimetype = 'text/plain', attachment = true) {
    if (fs.existsSync(filepath)) {
      const fileStat = fs.statSync(filepath)
      res.set('Content-Type', mimetype)

      if (fileStat.size !== 0) {
        res.set('Content-Length', fileStat.size)
      }

      if (attachment) {
        res.set('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`)
      }

      const acceptedEncoding = hasAcceptedEncoding(req, res)
      if (acceptedEncoding === 'gzip') {
        zlib.gzip(fs.readFileSync(filepath), (err, data) => {
          if (err) {
            throw err
          }

          res.set('Content-Length', data.length)
          res.end(data)
        })
      } else {
        res.removeHeader('content-encoding')

        const readStream = fs.createReadStream(filepath)
        readStream.on('data', data => res.write(data))
        readStream.on('end', () => res.end())
      }
    } else {
      throw new Error(`File ${filepath} doesn't exists.`)
    }
  }

  next()
}