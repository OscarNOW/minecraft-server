module.exports = {
    resetCamera: function () {
        if (!this.p.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.p.sendPacket('camera', {
            cameraId: this.entityId
        })
    }
}