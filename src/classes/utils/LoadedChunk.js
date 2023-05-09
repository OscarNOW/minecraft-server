const Chunk = require('../exports/Chunk.js');

const { chunks } = require('./Client/properties/public/dynamic/chunks.js');
const { blocks } = require('./Client/properties/public/dynamic/blocks.js');

const { chunkSize } = require('../../functions/loader/data.js');

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

    const absoluteX = x + this.x * (chunkSize.x.max - chunkSize.x.min);
    if (!this.blocksX.includes(absoluteX)) this.blocksX.push(absoluteX);

    blocks.setBlocks.call(this.client, { [x]: { [y]: { [z]: block } } });
}

class LoadedChunk extends Chunk {
    constructor(client, chunk, { x, z }, sendPacket) {
        super(chunk, block => updateBlock.call(this, block), { x: x * 16, y: 0, z: z * 16 });

        this.sendPacket = sendPacket; // todo: make private

        this.client = client;
        this.server = client.server;

        this.x = x;
        this.z = z;

        if (chunk instanceof LoadedChunk)
            this.blocksX = chunk?.blocksX ?? [];
        else if (chunk instanceof Chunk)
            this.blocksX = generateBlocksX.call(this, chunk);
        else
            throw new Error('Passed chunk is not instanceof Chunk or LoadedChunk')
    }

    remove() {
        this.sendPacket('unload_chunk', {
            chunkX: this.x,
            chunkZ: this.z
        })

        chunks.set.call(this.client, Object.freeze(this.client.chunks.filter(chunk => chunk !== this)));
    }
}

function generateBlocksX(chunk) {
    let blocksX = [];

    for (let relativeX in chunk.blocks) {
        relativeX = parseInt(relativeX);
        const x = relativeX + this.x * (chunkSize.x.max - chunkSize.x.min);

        if (!blocksX.includes(x))
            blocksX.push(x);
    }

    return blocksX;
}

module.exports = LoadedChunk;