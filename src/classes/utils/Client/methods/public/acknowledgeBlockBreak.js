const { blocks } = require('../../../../../functions/loader/data.js');

module.exports = function ({ x, y, z }, successful) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    const block = this.blocks[x]?.[y]?.[z];

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            block?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 2,
        successful
    })
}