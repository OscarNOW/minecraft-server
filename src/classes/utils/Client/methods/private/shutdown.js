module.exports = {
    shutdown() {
        if (this.p.state !== 'offline')
            this.p.stateHandler.updateState.close.call(this);
        for (const interval of this.p.intervals) clearInterval(interval);
        for (const timeout of this.p.timeouts) clearInterval(timeout);

        this.p.intervals = [];
        this.p.timeouts = [];
    }
}