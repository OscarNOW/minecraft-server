module.exports = function () {
    this.p.stateHandler.checkReady.call(this);

    this.p.sendPacket('close_window', {
        windowId: this.p.windowId
    })
}