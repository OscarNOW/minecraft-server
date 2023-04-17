const Chunk = require('../exports/Chunk.js');

const { chunks } = require('./Client/properties/public/dynamic/chunks.js');
const { blocks } = require('./Client/properties/public/dynamic/blocks.js');

function updateBlock(block) {
    const { x, y, z, stateId } = block;

    this.sendPacket('block_change', {
        location: {
            x,
            y,
            z
        },
        type: stateId
    })

    const absoluteX = x + this.x * 16; //todo: use chunkSize
    if (!this.blocksX.includes(absoluteX)) this.blocksX.push(absoluteX);

    blocks.setBlocks({ [x]: { [y]: { [z]: block } } });
}

class LoadedChunk extends Chunk {
    constructor(client, chunk, { x, z }, sendPacket) {
        super(chunk, block => updateBlock.call(this, block), { x: x * 16, y: 0, z: z * 16 });

        this.sendPacket = sendPacket; // todo: make private
        this.blocksX = chunk?.blocksX ?? [];

        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;
    }

    remove() {
        this.sendPacket('unload_chunk', {
            chunkX: this.x,
            chunkZ: this.z
        })

        chunks.set.call(this.client, Object.freeze(this.client.chunks.filter(chunk => chunk !== this)));
    }
}

module.exports = LoadedChunk;