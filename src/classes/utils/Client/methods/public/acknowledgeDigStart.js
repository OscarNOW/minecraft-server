const { blocks, chunkSize } = require('../../../../../functions/loader/data.js');

module.exports = function ({ x, y, z }, successful, blockName, blockState) {
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

    chunk.updateBlock(blockName, { x: blockX, y: blockY, z: blockZ }, blockState);

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            this.blocks[x]?.[y]?.[z]?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 0,
        successful
    })
}