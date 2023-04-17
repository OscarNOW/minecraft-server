let firstChangeEventListenerListeners = {};

module.exports = {
    onFirstChangeEventListener(type, cb) {
        if (!firstChangeEventListenerListeners[type])
            firstChangeEventListenerListeners[type] = [];

        firstChangeEventListenerListeners[type].push(cb);
    },
    firstChangeEventListenerListeners
}