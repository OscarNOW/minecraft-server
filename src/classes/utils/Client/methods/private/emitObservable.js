module.exports = {
    emitObservable: function (observable) {
        this.p.observables[observable].forEach(cb => cb(this[observable]))
    }
}