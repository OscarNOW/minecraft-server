const { blocks, chunkSize } = require('../../../../../functions/loader/data.js');

module.exports = function ({ x, y, z }, successful) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            this.chunks.find(({ blocks, x: chunkX, z: chunkZ }) => {

                const xOffset = chunkX * ((chunkSize.x.max - chunkSize.x.min) + 1);
                const yOffset = 0;
                const zOffset = chunkZ * ((chunkSize.z.max - chunkSize.z.min) + 1);

                const newX = x - xOffset;
                const newY = y - yOffset;
                const newZ = z - zOffset;

                return Boolean(blocks[newX]?.[newY]?.[newZ])

            })?.blocks?.[x]?.[y]?.[z]?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 0,
        successful
    })
}