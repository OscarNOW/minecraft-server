const BossBar = require('../../../BossBar.js');

module.exports = function (bossBarInfo) {
    return new BossBar(this, this.p.sendPacket, bossBarInfo);
}