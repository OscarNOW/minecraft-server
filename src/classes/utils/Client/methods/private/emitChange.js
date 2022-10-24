module.exports = {
    emitChange(type) {
        for (const cb of this.p.changeEvents[type])
            cb(this[type])
    }
}