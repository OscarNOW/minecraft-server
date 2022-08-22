const Text = require('../../../../exports/Text.js');

module.exports = function (message = '') {
    this.p.stateHandler.checkReady.call(this);

    if (!(message instanceof Text))
        message = new Text(message)

    this.p.sendPacket('chat', {
        message: JSON.stringify(message.chat),
        position: 0,
        sender: '0'
    });
}