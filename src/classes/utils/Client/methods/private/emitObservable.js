module.exports = {
    emitObservable: function (observable) {
        for (const cb of this.p.observables[observable]) cb(this[observable])
    }
}