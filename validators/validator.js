const stringValidator = require('./string');
const integerValidator = require('./integer');
const numberValidator = require('./number');
const booleanValidator = require('./boolean');
const BadRequest = require("../../tamia/modules/common/errors/bad-request");

module.exports = {
    _validateValue(value, schema) {
        const getDefaultFromSchema = (schema) => {
            let value = undefined !== schema.default ? schema.default : undefined;

            return undefined === value && schema.nullable ? null : value;
        };

        switch (schema.type) {
            case 'string':
            default:
                return stringValidator.validate(value, schema);
            case 'integer':
                return integerValidator.validate(value, schema);
            case 'number':
                return numberValidator.validate(value, schema);
            case 'boolean':
                return booleanValidator.validate(value, schema);
            case 'object':
                if (!value) {
                    return getDefaultFromSchema(schema);
                } else if (!schema.properties) {
                    return value;
                }

                return module.exports.validate(value, schema);
            case 'array':
                if (!value) {
                    return getDefaultFromSchema(schema);
                }

                return value.map(item => module.exports.validate(item, schema.items));
        }
    },

    /**
     * Validate data with schema
     *
     * @param {*} data
     * @param {Object} schema
     * @return {Object}
     */
    validate(data, schema) {
        let model = {};

        if (!schema.properties) {
            return module.exports._validateValue(data, schema);
        }

        const requiredFields = schema.required || [];
        for (let key in schema.properties) {
            if (!schema.properties.hasOwnProperty(key)) {
                continue;
            }

            const schemaField = schema.properties[key];

            // If value required but undefined
            if (
                (schemaField.required || requiredFields.includes(key)) &&
                undefined === data[key]
            ) {
                throw new BadRequest(`Parameter "${key}" is required`);
            }

            // If value not required but undefined and have no default value or set nullable
            if (
                (!schemaField.required && !requiredFields.includes(key)) &&
                undefined === data[key] &&
                undefined === schemaField.default &&
                undefined === schemaField.nullable
            ) {
                continue;
            }

            try {
                const value = data ? data[key] : null;
                model[key] = module.exports._validateValue(value, schemaField);

                // Cleaning model
                if (model[key] === undefined) {
                    delete model[key];
                }
            } catch (e) {
                throw new BadRequest(`Parameter "${key}": ${e.message}`);
            }
        }

        return model;
    }
}
