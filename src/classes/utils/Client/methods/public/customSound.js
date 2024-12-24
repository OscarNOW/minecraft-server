const { soundChannels } = require('../../../../../functions/loader/data.js');

module.exports = function ({ sound, channel, position: { x, y, z }, volume, pitch }) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!soundChannels.includes(channel))
        throw new Error(`Unknown sound channel "${channel}"`);

    if (typeof volume !== 'number' || isNaN(volume) || volume < 0 || volume > 1)
        throw new Error(`Volume must be a number between 0 and 1, received ${volume} (${typeof volume})`);

    // Multiplying by 8 is needed, see https://minecraft.wiki/w/Minecraft_Wiki:Projects/wiki.vg_merge/Protocol?oldid=2772553#Sound_Effect
    this.p.sendPacket('named_sound_effect', {
        soundName: sound,
        soundCategory: soundChannels.indexOf(channel),
        x: Math.round(x * 8),
        y: Math.round(y * 8),
        z: Math.round(z * 8),
        volume,
        pitch
    })
}