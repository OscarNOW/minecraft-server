const CustomError = require('../../../CustomError.js');

module.exports = {
    on: function (event, listener) {
        if (!this.p.events[event])
            throw new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: Object.keys(this.p.events)
            }, this.on).toString()

        this.p.events[event].push(listener);
    }
}