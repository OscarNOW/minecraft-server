function applyDefaults(properties, defaults) {
    if (properties === undefined) return defaults;
    if (typeof properties !== 'object' || defaults === null) return properties;
    if (typeof defaults !== 'object' || defaults === null) return properties;

    for (const key of Object.keys(defaults))
        properties[key] = applyDefaults(properties[key], defaults[key])

    return properties;
}

module.exports = Object.freeze({ applyDefaults });