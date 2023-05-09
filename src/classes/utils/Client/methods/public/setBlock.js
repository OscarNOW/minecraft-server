const { chunkSize } = require('../../../../../functions/loader/data.js');

module.exports = function (block, { x, y, z }, state) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const chunkX = Math.floor(x / (chunkSize.x.max - chunkSize.x.min));
    const chunkZ = Math.floor(z / (chunkSize.z.max - chunkSize.z.min));

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);
    if (!chunk)
        return;

    let blockX = x % (chunkSize.x.max - chunkSize.x.min);
    let blockY = y;
    let blockZ = z % (chunkSize.z.max - chunkSize.z.min);

    if (blockX < 0) blockX += (chunkSize.x.max - chunkSize.x.min);
    if (blockY < 0) blockY += (chunkSize.y.max - chunkSize.y.min);
    if (blockZ < 0) blockZ += (chunkSize.z.max - chunkSize.z.min);

    chunk.setBlock(block, { x: blockX, y: blockY, z: blockZ }, state);

    return this;
}