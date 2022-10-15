const Text = require('../../../../exports/Text.js');

module.exports = function (message = '') {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!(message instanceof Text))
        message = new Text(message);

    this.p.sendPacket('title', {
        action: 2,
        text: JSON.stringify(message.chat)
    })
}
