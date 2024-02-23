const stringValidator = require('../validators/string')
const integerValidator = require('../validators/integer')
const booleanValidator = require('../validators/boolean')
const numberValidator = require('../validators/number')

module.exports = {
  /**
   * Create object from OpenAPI model
   *
   * @param {*} data
   * @param {Object} model
   * @param {Boolean} [shutdownError=false]
   * @return {Object}
   */
  createFromModel(data, model, shutdownError = false) {
    let newModel = {}

    if (!model.properties) {
      newModel = data
    }

    for (let key in model.properties) {
      if (!model.properties.hasOwnProperty(key)) {
        continue
      }

      if (model.required && model.required.includes(key) && !data[key]) {
        if (shutdownError) {
          console.error(`Parameter "${key}" is required`)
          continue
        }

        throw new Error(`Parameter "${key}" is required`)
      }

      switch (model.properties[key].type) {
        case 'string':
        default:
          newModel[key] = stringValidator.parse(data[key], model.properties[key])
          break;
        case 'integer':
          newModel[key] = integerValidator.parse(data[key], model.properties[key])
          break;
        case 'number':
          newModel[key] = numberValidator.parse(data[key], model.properties[key])
          break;
        case 'boolean':
          newModel[key] = booleanValidator.parse(data[key], model.properties[key])
          break;
        case 'object':
          newModel[key] = module.exports.createFromModel(data[key], model.properties[key])
          break;
        case 'array':
          newModel[key] = (data[key] || []).map(item => module.exports.createFromModel(item, model.properties[key].items))
          break;
      }

      // Cleaning model
      if (newModel[key] === undefined) {
        delete newModel[key]
      }
    }

    return newModel
  },
};
