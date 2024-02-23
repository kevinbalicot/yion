const validator = require('../validators/validator')
const BadRequestError = require('../errors/bad-request')

module.exports = (schemas) => (context, next) => {
  const {req} = context
  const requestBody = schemas.requestBody
  const contentType = req.headers['content-type']
  let body = null

  if (requestBody) {
    if (!requestBody.content[contentType]) {
      throw new BadRequestError(`Bad content type, please use ${Object.keys(requestBody.content).join()}`)
    }

    body = validator.validate(req.body, requestBody.content[contentType].schema)
  }

  req.body = body

  next()
}