const CustomError = require('../../../CustomError.js');

module.exports = function (event, callback) {
    if (!this.p.events[event])
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.once(${require('util').inspect(event)}, ...)  `, {
            got: event,
            expectationType: 'value',
            expectation: Object.keys(this.p.events)
        }, this.on))

    this.p.events[event].push({ callback, once: true });
}