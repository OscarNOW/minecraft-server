module.exports = {
    explosion({ x, y, z }, playerVelocity, strength, destroyedBlocks) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this[this.ps.sendPacket]('explosion', {
            x,
            y,
            z,
            radius: strength,
            affectedBlockOffsets: destroyedBlocks.map(destroyedBlock => ({
                x: destroyedBlock.xOffset,
                y: destroyedBlock.yOffset,
                z: destroyedBlock.zOffset
            })),
            playerMotionX: playerVelocity.x,
            playerMotionY: playerVelocity.y,
            playerMotionZ: playerVelocity.z
        })
    }
}