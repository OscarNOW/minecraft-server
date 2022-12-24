const LoadedChunk = require('../../../LoadedChunk.js');
const { chunks } = require('../../properties/public/dynamic/chunks.js');

module.exports = function (chunk, { x, z }) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const loadedChunk = new LoadedChunk(this, chunk, { x, z }, this.p.sendPacket); //todo-time: takes long, only create loadedChunk when <Client>.chunks is accessed

    this.p.sendPacket('map_chunk', { //todo-time: takes long, maybe implement cache so that chunk and getMask only have to be called once
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
    });

    chunks.setPrivate.call(this, Object.freeze([loadedChunk, ...this.chunks]));
}