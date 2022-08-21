module.exports = {
    emit: function (name, ...args) {
        for (const listener of this.p.events[name])
            listener(...args)
    }
}