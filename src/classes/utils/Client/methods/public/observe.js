module.exports = {
    observe: function (observable, cb) {
        if (!this.p.observables[observable])
            throw new Error(`Unknown observable "${observable}" (${typeof observable})`);

        this.p.observables[observable].push(cb);
    }
}