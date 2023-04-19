const LoadedChunk = require('../../../LoadedChunk.js');

const { chunks } = require('../../properties/public/dynamic/chunks.js');
const { blocks } = require('../../properties/public/dynamic/blocks.js');

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

    //todo: if the user passes a chunk and then changes the chunk, we'll be copying the new chunk instead of the old one
    const generateLoadedChunk = () => new LoadedChunk(this, chunk, { x, z }, this.p.sendPacket);

    if (this.p.generatedChunks)
        chunks.set.call(this, Object.freeze([generateLoadedChunk(), ...chunks.getPrivate.call(this)])); //generate loadedChunk and add it to chunks
    else
        chunks.set.call(this, Object.freeze([generateLoadedChunk, ...chunks.getPrivate.call(this)])); //don't generate loadedChunk, and add generator to chunks, so that chunks can generate it when needed

    if (this.p.generatedBlocks) {
        const chunk = this.chunks.find(chunk => chunk.x === x && chunk.z === z);
        blocks.setBlocks(chunk.blocks)
    }
}