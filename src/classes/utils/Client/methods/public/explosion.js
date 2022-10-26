module.exports = function ({ x, y, z }, playerVelocity, strength, destroyedBlocks) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

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