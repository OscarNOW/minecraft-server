const { soundChannels } = require('../../../../../functions/loader/data.js');

module.exports = function ({ soundName, channel } = {}) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (channel && !soundChannels.includes(channel))
        throw new Error(`Unknown sound channel "${channel}"`);

    if (soundName && typeof soundName !== 'string')
        throw new Error(`Unknown sound name "${soundName}"`);

    this.p.sendPacket('stop_sound', {
        flags: channel ? (soundName ? 3 : 1) : (soundName ? 2 : 1),
        source: channel ? soundChannels.indexOf(channel) : undefined,
        sound: soundName ?? undefined
    });
}