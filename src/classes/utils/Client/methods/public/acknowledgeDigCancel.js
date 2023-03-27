const blocks = require('../../../../../data/blocks.json');

//todo see todo in block_dig in Client events

module.exports = function ({ x, y, z }, successful) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('acknowledge_player_digging', {
        location: { x, y, z },
        block:
            this.chunks.find(({ blocks }) => blocks[x]?.[y]?.[z])?.blocks?.[x]?.[y]?.[z]?.stateId ??
            blocks.find(([name]) => name === 'air')[1],
        status: 1,
        successful
    })
}