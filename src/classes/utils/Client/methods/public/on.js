const { firstChangeEventListenerListeners } = require('../private/onFirstChangeEventListener.js');

module.exports = function (event) {
    if (event === 'change') {
        const type = arguments[1];
        const callback = arguments[2];

        if (!this.p.changeEvents[type])
            throw new Error(`Unknown change event type "${type}"`);

        if (this.p.changeEvents[type].length === 0) firstChangeEventListenerListeners[type]?.forEach?.(cb => cb({ callback, once: false }))
        this.p.changeEvents[type].push({ callback, once: false });

    } else {
        const callback = arguments[1];

        if (!this.p.events[event])
            throw new Error(`Unknown event "${event}"`);

        this.p.events[event].push({ callback, once: false });

    }
}