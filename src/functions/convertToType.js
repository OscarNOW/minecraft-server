module.exports = Object.freeze({
    convertToType: (values) => {
        let type = values.map(a => ['number', 'boolean'].includes(typeof a) ? a : `'${a}'`).sort().join('|');
        if (type == ['true', 'false'].sort().join('|'))
            type = 'boolean'

        return type
    }
})