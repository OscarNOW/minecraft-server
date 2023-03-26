const WorldBorder = require('../../../../WorldBorder.js');

module.exports = {
    worldBorder() {
        return new WorldBorder(this, this.p.sendPacket);
    }
}