module.exports = {
    observe: function (observable, cb) {
        if (!this[this.ps.observables][observable])
            throw new Error(`Unknown observable "${observable}" (${typeof observable})`);

        this[this.ps.observables][observable].push(cb);
    }
}