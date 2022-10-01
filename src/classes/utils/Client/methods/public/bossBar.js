const BossBar = require('../../../BossBar.js');

module.exports = function (bossBarInfo) {
    new BossBar(this, this.p.sendPacket, bossBarInfo);
}