const LoadedChunk = require('../../../LoadedChunk.js');
const { chunks } = require('../../properties/public/dynamic/chunks.js');

module.exports = function (chunk, { x, z }) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('map_chunk', { //todo-time: takes long, maybe implement cache so that chunk and getMask only have to be called once
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
    });

    const loadedChunk = () => new LoadedChunk(this, chunk, { x, z }, this.p.sendPacket);

    if (this.p.generatedChunks)
        chunks.setPrivate.call(this, Object.freeze([loadedChunk(), ...chunks.getPrivate.call(this)]));
    else
        chunks.setPrivate.call(this, Object.freeze([loadedChunk, ...chunks.getPrivate.call(this)]));
}