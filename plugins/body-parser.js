const os = require('os')
const fs = require('fs')
const path = require('path')

let busboy
try {
  busboy = require.main.require('busboy')
} catch (e) {
  throw new Error(`To use body parser plugin, install busboy lib : ${e.message}`)
}

module.exports = () => (context, next) => {
  const {req, res} = context
  const headers = req.headers

  if (
    req.method === 'POST' &&
    headers['content-type'] &&
    headers['content-type'].match(/multipart\/form-data|application\/x-www-form-urlencoded/i)
  ) {
    req.body = {}
    const bus = busboy({headers})
    const tmpFiles = []

    bus.on('file', (name, file, info) => {
      const {filename, encoding, mimeType} = info
      const saveTo = path.join(os.tmpdir(), path.basename(filename || 'unknown'))
      if (!tmpFiles.find(f => f === saveTo)) {
        tmpFiles.push(saveTo)
      }

      file.pipe(fs.createWriteStream(saveTo))
      file.on('data', data => {
        req.body[name] = {filename, encoding, mimeType, filepath: saveTo, length: data.length, data}
      })
    })

    bus.on('field', (fieldName, value) => {
      const objectMatcher = fieldName.match(/(\w+)\[(\w+)\]/i)
      if (objectMatcher) {
        if (!req.body[objectMatcher[1]]) {
          req.body[objectMatcher[1]] = !Number.isNaN(parseInt(objectMatcher[2])) ? [] : {}
        }

        try {
          req.body[objectMatcher[1]][parseInt(objectMatcher[2]) || objectMatcher[2]] = JSON.parse(value)
        } catch (e) {
          req.body[objectMatcher[1]][parseInt(objectMatcher[2]) || objectMatcher[2]] = value
        }
      } else {
        req.body[fieldName] = value
      }
    })

    bus.on('finish', () => next())
     .on('finish', () => tmpFiles.forEach(file => fs.unlink(file, () => {})))

    bus.on('error', (e) => {
      console.error(e)
      res.writeHead(500, e.message)
      res.end()
    })

    req.pipe(bus)
  } else if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      req.parseBody(body)
      next()
    })
  } else {
    next()
  }
}
