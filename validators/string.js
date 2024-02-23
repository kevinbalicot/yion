module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? String(def) : (schema.nullable ? null : undefined);
        }

        if (schema.enum && Array.isArray(schema.enum) && !schema.enum.includes(data)) {
            throw new Error(`Value must be one of ${schema.enum.join()}`);
        }

        switch (schema.format) {
            case 'date':
                return this._parseDate(data, 'date');
            case 'date-time':
                return this._parseDate(data, 'date-time');
            case 'byte':
                return this._parseBase64(data);
            default:
                return String(data);
        }
    },

    parse(data, schema) {
        return this.validate(data, schema);
    },

    _parseDate(value, type = 'date') {
        if (value instanceof Date) {
            return 'date' === type ? value.toDateString() : value.toString();
        } else {
            return new Date(value);
        }
    },

    _parseBase64(value) {
        if (value.match(/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?$/)) {
            const buffer = Buffer.from(value, 'base64');

            return buffer.toString('utf-8');
        } else {
            const buffer = Buffer.from(value, 'utf-8');

            return buffer.toString('base64');
        }
    },
}
