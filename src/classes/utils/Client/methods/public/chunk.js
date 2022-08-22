module.exports = function (chunk, { x, z }) {
    this.p.stateHandler.checkReady.call(this);

    this.p.sendPacket('map_chunk', {
        x,
        z,
        groundUp: true,
        biomes: chunk._chunk.dumpBiomes !== undefined ? chunk._chunk.dumpBiomes() : undefined,
        heightmaps: {
            type: 'compound',
            name: '',
            value: {}
        },
        bitMap: chunk._chunk.getMask(),
        chunkData: chunk._chunk.dump(),
        blockEntities: []
    })
}