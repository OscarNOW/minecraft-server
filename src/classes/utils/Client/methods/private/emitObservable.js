module.exports = {
    emitObservable: function (type) {
        this.p.observables[type].forEach(cb => cb())
    }
}