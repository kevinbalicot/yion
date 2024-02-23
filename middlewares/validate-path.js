const validator = require('../validators/validator')

module.exports = (schemas = {}) => (context, next) => {
  const {req} = context

  const schemaModel = { properties: {} };
  (schemas.parameters || [])
    .filter(parameter => parameter.in === 'path')
    .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required })

  req.params = validator.validate(req.params, schemaModel)

  next()
}