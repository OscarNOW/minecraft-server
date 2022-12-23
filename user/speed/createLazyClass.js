module.exports = (loadTarget, name) => {
    let cachedTarget;
    const target = () => {
        if (cachedTarget === undefined)
            cachedTarget = loadTarget();

        return cachedTarget;
    };

    const Placeholder = class { };
    Placeholder.prototype = Object.create(null);
    Object.defineProperty(Placeholder, 'name', {
        value: name || ''
    });

    const lazy = new Proxy(Placeholder, {
        getPrototypeOf() {
            return target();
        },
        has(_, key) {
            return key in target();
        },
        get(_, key) {
            return target()[key];
        },
        construct(_, argArray) {
            return new (target())(...argArray);
        }
    });

    return lazy;

};