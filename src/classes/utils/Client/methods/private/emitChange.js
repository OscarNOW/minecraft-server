module.exports = {
    emitChange(type) {
        for (const { callback } of this.p.changeEvents[type])
            callback(this[type])

        this.p.changeEvents[type] = this.p.changeEvents[type].filter(({ once }) => once == false);
    }
}