module.exports = function () {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (this.p.windowId === null || this.p.windowId === undefined)
        return;

    this.p.sendPacket('close_window', {
        windowId: this.p.windowId
    });

    this.p.windowId = null;
}