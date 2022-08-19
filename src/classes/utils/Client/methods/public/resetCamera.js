module.exports = {
    resetCamera: function () {
        this.p.stateHandler.checkReady.call(this);

        this.p.sendPacket('camera', {
            cameraId: this.entityId
        })
    }
}