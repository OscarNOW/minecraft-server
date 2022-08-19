module.exports = {
    explosion({ x, y, z }, playerVelocity, strength, destroyedBlocks) {
        this.p.stateHandler.checkReady.call(this);

        this.p.sendPacket('explosion', {
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