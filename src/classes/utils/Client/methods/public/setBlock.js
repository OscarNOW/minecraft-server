module.exports = function (block, { x, y, z }, state) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const chunkX = Math.floor(x / 16);
    const chunkZ = Math.floor(z / 16);

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);
    if (!chunk)
        return;

    //todo: mod doesn't work with negative numbers
    let blockX = x % 16; //todo: use chunkSize instead of 16
    let blockY = y;
    let blockZ = z % 16; //todo: use chunkSize instead of 16

    if (blockX < 0) blockX += 16;
    if (blockY < 0) blockY += 16;
    if (blockZ < 0) blockZ += 16;

    chunk.setBlock(block, { x: blockX, y: blockY, z: blockZ }, state);

    return this;
}