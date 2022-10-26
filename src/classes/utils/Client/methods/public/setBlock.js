module.exports = function (block, { x, y, z }, state) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const chunkX = Math.floor(x / 16);
    const chunkZ = Math.floor(z / 16);

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);
    if (!chunk)
        return;

    const blockX = x % 16;
    const blockY = y;
    const blockZ = z % 16;

    chunk.setBlock(block, { x: blockX, y: blockY, z: blockZ }, state);

    return this;
}