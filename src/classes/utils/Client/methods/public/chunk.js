const LoadedChunk = require('../../../LoadedChunk.js');
const { chunks } = require('../../properties/public/dynamic/chunks.js');

module.exports = function (chunk, { x, z }) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('map_chunk', {
        x,
        z,
        groundUp: true,
        biomes: chunk.chunkData.biomes,
        heightmaps: {
            type: 'compound',
            name: '',
            value: {}
        },
        bitMap: chunk.chunkData.bitMap,
        chunkData: chunk.chunkData.chunkData,
        blockEntities: []
    });

    const loadedChunk = () => new LoadedChunk(this, chunk, { x, z }, this.p.sendPacket);

    if (this.p.generatedChunks)
        chunks.setPrivate.call(this, Object.freeze([loadedChunk(), ...chunks.getPrivate.call(this)])); //generate loadedChunk and add it to chunks
    else
        chunks.setPrivate.call(this, Object.freeze([loadedChunk, ...chunks.getPrivate.call(this)])); //don't generate loadedChunk, and add generator to chunks, so that chunks can generate it when needed
}