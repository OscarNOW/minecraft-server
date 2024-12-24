const { items } = require('../../../../../functions/loader/data.js');

module.exports = function (item, seconds = 3) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!items.find(({ name }) => name === item))
        throw new Error(`Unknown item "${item}"`);

    const ticks = seconds * 20;

    this.p.sendPacket('set_cooldown', {
        itemID: items.find(({ name }) => name === item).id,
        cooldownTicks: ticks
    });
}