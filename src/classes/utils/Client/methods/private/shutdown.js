module.exports = {
    shutdown() {
        this.p.stateHandler.updateState.close.call(this);
        for (const interval of this.p.intervals) clearInterval(interval);
        for (const timeout of this.p.timeouts) clearInterval(timeout);
    }
}