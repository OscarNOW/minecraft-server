module.exports = {
    emitChange(changable) {
        for (const cb of this.p.observables[changable])
            cb(this[changable])
    }
}