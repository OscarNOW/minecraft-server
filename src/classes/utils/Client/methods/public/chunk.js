module.exports = function (chunk, { x, z }) {
    this.p.stateHandler.checkReady.call(this);

    this.p.sendPacket('map_chunk', {
        x,
        z,
        groundUp: true,
        biomes: chunk.chunk.dumpBiomes?.(),
        heightmaps: {
            type: 'compound',
            name: '',
            value: {}
        },
        bitMap: chunk.chunk.getMask(),
        chunkData: chunk.chunk.dump(),
        blockEntities: []
    })
}