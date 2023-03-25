module.exports = Object.freeze({
    convertToType: values => {
        let type = values.map(a => {
            if (['number', 'boolean'].includes(typeof a))
                return a;

            if (!a.includes("'"))
                return `'${a}'`;
            else if (!a.includes('"'))
                return `"${a}"`;
            else if (!a.includes('`'))
                return `\`${a}\``;
            else
                return `'${a.replaceAll("'", "\\'")}'`;

        }).sort().join('|');

        if (type === ['true', 'false'].sort().join('|'))
            type = 'boolean'

        return type
    }
})