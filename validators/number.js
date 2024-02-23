module.exports = {
    validate(data, schema) {
        if (undefined === data || null === data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? this._parseNumber(def) : (schema.nullable ? null : undefined);
        }

        if (isNaN(data)) {
            throw new Error('Value is not a number');
        }

        if (schema.enum && Array.isArray(schema.enum) && schema.enum.includes(data)) {
            throw new Error(`Value must be one of ${schema.enum.join()}`);
        }

        return this._parseNumber(data);
    },

    parse(data, schema) {
        return this.validate(data, schema);
    },

    _parseNumber(number) {
        return Number.isInteger(number) ? parseInt(number) : parseFloat(number);
    },
};
