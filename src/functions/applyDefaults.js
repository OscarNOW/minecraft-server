function applyDefaults(properties, defaults) {
    if (properties === undefined) return defaults;
    if (typeof properties !== 'object' || defaults === null) return properties;
    if (typeof defaults !== 'object' || defaults === null) return properties;

    for (const key of Object.keys(defaults)) {
        //prevent prototype pollution
        if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;
        if (['__proto__', 'constructor', 'prototype'].includes(key)) continue;

        properties[key] = applyDefaults(properties[key], defaults[key])
    };

    return properties;
}

module.exports = { applyDefaults };