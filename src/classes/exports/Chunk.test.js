const Chunk = require('./Chunk.js');
const Block = require('../utils/Block.js');

module.exports = expect => {
    let chunk = new Chunk();

    chunk.setBlock('stone', { x: 0, y: 0, z: 0 });

    expect(chunk.blocks, { 0: { 0: { 0: chunk.blocks?.[0]?.[0]?.[0] } } });
    expect(chunk.blocks?.[0]?.[0]?.[0] instanceof Block, true);

    chunk.setBlock('air', { x: 0, y: 0, z: 0 });

    expect(chunk.blocks, {});

    chunk.setBlock('grass_block', { x: 0, y: 0, z: 0 }, { snowy: true });

    expect(chunk.blocks?.[0]?.[0]?.[0].state, { snowy: true });

    expect(chunk.setBlock('stone', { x: 0, y: 0, z: 0 }), chunk);
}