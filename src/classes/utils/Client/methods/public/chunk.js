const LoadedChunk = require('../../../LoadedChunk.js');
const { chunks } = require('../../properties/public/dynamic/chunks.js');

module.exports = function (chunk, { x, z }) {
    this.p.stateHandler.checkReady.call(this);

    const loadedChunk = new LoadedChunk(this, chunk, { x, z });

    this.p.sendPacket('map_chunk', {
        x,
        z,
        groundUp: true,
        biomes: loadedChunk.chunk.dumpBiomes?.(),
        heightmaps: {
            type: 'compound',
            name: '',
            value: {}
        },
        bitMap: loadedChunk.chunk.getMask(),
        chunkData: loadedChunk.chunk.dump(),
        blockEntities: []
    })

    chunks.setPrivate.call(this, [loadedChunk, ...this.chunks]);
}