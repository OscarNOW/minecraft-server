module.exports = {
    emit(name, ...args) {
        for (const { callback } of this.p.events[name])
            callback(...args)

        this.p.events[name] = this.p.events[name].filter(({ once }) => once == false);
    }
}