module.exports = {
    shutdown: function () {
        this.p.stateHandler.updateState.close.call(this);
        this.p.intervals.forEach(interval => clearInterval(interval));
        this.p.timeouts.forEach(timeout => clearInterval(timeout));
    }
}