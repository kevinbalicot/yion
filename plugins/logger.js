module.exports = () => (context, next) => {
  const {req, res} = context
  const startTime = performance.now()

  res.on('finish', () => {
    const endTime = performance.now()
    console.log(`${new Date()} - ${req.ip} - ${req.method} ${req.uri} => ${res.statusCode} : ${res.statusMessage} ${(endTime - startTime).toFixed(2)}ms`)
  })

  context.logger = {
    info: (message) => console.log(`[INFO] ${message}`),
    debug: (message) => console.debug(`[DEBUG] ${message}`),
    warn: (message) => console.warn(`[WARN] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`)
  }

  next()
}