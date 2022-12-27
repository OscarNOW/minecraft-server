module.exports = {
    emitChange(type, oldValue) {
        for (const { callback } of this.p.changeEvents[type])
            callback(this[type], oldValue);

        this.p.changeEvents[type] = this.p.changeEvents[type].filter(({ once }) => once === false);
    }
}