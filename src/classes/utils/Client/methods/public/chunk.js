const LoadedChunk = require('../../../LoadedChunk.js');

const { chunks } = require('../../properties/public/dynamic/chunks.js');
const { blocks } = require('../../properties/public/dynamic/blocks.js');

const { chunkSize } = require('../../../../../functions/loader/data.js');

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

    const generateLoadedChunk = () => new LoadedChunk(this, chunk, { x, z }, this.p.sendPacket);

    if (this.p.generatedChunks)
        chunks.set.call(this, Object.freeze([generateLoadedChunk(), ...chunks.getPrivate.call(this)])); //generate loadedChunk and add it to chunks
    else
        chunks.set.call(this, Object.freeze([generateLoadedChunk, ...chunks.getPrivate.call(this)])); //don't generate loadedChunk, and add generator to chunks, so that chunks can generate it when needed

    const generateClientBlocks = () => {
        let blocks = {};

        for (const chunk of this.chunks)
            for (const relativeX in chunk.blocks) {
                const x = chunk.x * (chunkSize.x.max - chunkSize.x.min) + relativeX;
                blocks[x] = {};

                for (const y in chunk.blocks[relativeX]) {
                    blocks[x][y] = {};

                    for (const relativeZ in chunk.blocks[relativeX][y]) {
                        const z = chunk.z * (chunkSize.z.max - chunkSize.z.min) + relativeZ;

                        blocks[x][y][z] = chunk.blocks[relativeX][y][relativeZ];
                    }
                }
            }

        return blocks;
    };

    if (this.p.generatedBlocks) {
        blocks.set.call(this, generateClientBlocks());
    } else {
        blocks.set.call(this, generateClientBlocks);
    }
}