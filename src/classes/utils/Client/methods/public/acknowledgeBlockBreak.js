const { blocks } = require('../../../../../functions/loader/data.js');

module.exports = function ({ x, y, z }, successful) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            this.blocks[x]?.[y]?.[z]?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 2,
        successful
    })
}