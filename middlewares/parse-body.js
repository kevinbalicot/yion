module.exports = (context, next) => {
  const {req, res} = context

  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('error', err => {
    res.status(500).send(err)
  })

  req.on('end', () => {
    req.parseBody(body)
    next(req.body)
  })
}