module.exports = {
    emit: function (name, ...args) {
        for (const { callback, once } of this.p.events[name]) {
            callback(...args)

            if (once)
                this.p.events[name].splice(this.p.events[name].findIndex(({ callback: checkCallback }) => checkCallback == callback), 1);
        }
    }
}