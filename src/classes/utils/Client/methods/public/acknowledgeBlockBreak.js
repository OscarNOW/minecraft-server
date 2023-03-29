const blocks = require('../../../../../data/blocks.json');

module.exports = function ({ x, y, z }, successful) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const chunkX = Math.floor(x / 16);
    const chunkZ = Math.floor(z / 16);

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);

    let chunkRelativeX = x % 16; //todo: use chunkSize instead of 16
    let chunkRelativeY = y;
    let chunkRelativeZ = z % 16; //todo: use chunkSize instead of 16

    if (chunkRelativeX < 0) chunkRelativeX += 16;
    if (chunkRelativeY < 0) chunkRelativeY += 16;
    if (chunkRelativeZ < 0) chunkRelativeZ += 16;

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            chunk?.blocks?.[chunkRelativeX]?.[chunkRelativeY]?.[chunkRelativeZ]?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 2,
        successful
    })
}