const CustomError = require('../../../CustomError.js');

module.exports = function (event) {
    if (event == 'change') {
        const type = arguments[1];
        const callback = arguments[2];

        if (!this.p.changeEvents[type])
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `type in  <${this.constructor.name}>.once('change', ${require('util').inspect(type)}, ...)  `, {
                got: type,
                expectationType: 'value',
                expectation: Object.keys(this.p.changeEvents)
            }, this.on, { server: this.server, client: this }));

        this.p.changeEvents[type].push({ callback, once: true });

    } else {
        const callback = arguments[1];

        if (!this.p.events[event])
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.once(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: Object.keys(this.p.events)
            }, this.on, { server: this.server, client: this }));

        this.p.events[event].push({ callback, once: true });

    }
}