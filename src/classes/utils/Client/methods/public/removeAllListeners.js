module.exports = function (event) {
    if (event)
        this.p.events[event] = [];
    else
        for (const event of this.p.events)
            this.p.events[event] = [];
}