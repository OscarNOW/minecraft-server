const Block = require('./Block.js');

module.exports = expect => {
    let block = new Block('stone', {}, { x: 12, y: 15, z: 9 });

    expect(block.block, 'stone');
    expect(block.state, {});
    expect(block.stateId, 1);

    expect(block.x, 12);
    expect(block.y, 15);
    expect(block.z, 9);

}