const CustomError = require('../../../CustomError.js');

module.exports = function (observable, cb) {
    if (!this.p.observables[observable])
        throw new CustomError('expectationNotMet', 'libraryUser', `observable in  <${this.constructor.name}>.observe(${require('util').inspect(observable)}, ...)  `, {
            got: observable,
            expectationType: 'value',
            expectation: Object.keys(this.p.observables)
        }, this.observe).toString()

    this.p.observables[observable].push(cb);
}