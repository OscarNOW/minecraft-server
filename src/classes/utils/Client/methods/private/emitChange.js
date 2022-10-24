module.exports = {
    emitChange(type) {
        for (const { callback } of this.p.changeEvents[type])
            callback(this[type])

        //todo: implement once
    }
}