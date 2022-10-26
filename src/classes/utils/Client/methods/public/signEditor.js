module.exports = function (location) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('open_sign_entity', {
        location
    })
}