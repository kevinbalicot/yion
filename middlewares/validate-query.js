const validator = require('../validators/validator')

module.exports = (schemas = {}) => (context, next) => {
  const {req} = context

  const schemaModel = { properties: {} };
  (schemas.parameters || [])
    .filter(parameter => parameter.in === 'query')
    .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required })

  req.query = validator.validate(req.query, schemaModel)

  next()
}