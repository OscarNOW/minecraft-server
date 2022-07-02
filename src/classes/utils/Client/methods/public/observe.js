module.exports = {
    observe: function (observable, cb) {
        if (!this.p.observables[observable])
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'observable', ''],
                    ['in the function "', 'observe', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: observable,
                    expectationType: 'value',
                    expectation: Object.keys(this.p.observables)
                }, this.observe).toString()

        this.p.observables[observable].push(cb);
    }
}