module.exports = function (event) {
    //todo: add error when event isn't correct
    if (event)
        if (event === 'change')
            for (const type of Object.keys(this.p.changeEvents))
                this.p.changeEvents[type] = [];
        else
            this.p.events[event] = [];
    else {
        for (const event of Object.keys(this.p.events))
            this.p.events[event] = [];

        for (const type of Object.keys(this.p.changeEvents))
            this.p.changeEvents[type] = [];
    }
}