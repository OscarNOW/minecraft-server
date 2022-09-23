module.exports = {
    emitObservable(observable) {
        for (const cb of this.p.observables[observable]) cb(this[observable])
    }
}