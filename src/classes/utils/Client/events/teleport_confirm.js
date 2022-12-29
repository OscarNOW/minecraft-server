const { position: { confirm } } = require('../properties/public/dynamic/position');

module.exports = {
    teleport_confirm({ teleportId }) {
        confirm.call(this, teleportId)
    }
}