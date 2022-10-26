module.exports = function () {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('camera', {
        cameraId: this.entityId
    })
}