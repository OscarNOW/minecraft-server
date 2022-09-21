module.exports = function (location) {
    this.p.stateHandler.checkReady.call(this);

    this.p.sendPacket('open_sign_entity', {
        location
    })
}