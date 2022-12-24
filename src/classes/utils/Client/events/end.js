module.exports = {
    end: function () {
        if (!this.p.stateHandler.checkReady.call(this))
            return;

        this.p.shutdown()
    }
}