function applyDefaults(properties, defaults) {
    if (properties === undefined) return defaults;
    if (typeof properties !== 'object') return properties;

    for (const key of Object.keys(defaults))
        properties[key] = applyDefaults(properties[key], defaults[key])

    return properties;
}

module.exports = Object.freeze({ applyDefaults });