const Text = require('../../../../exports/Text.js');

module.exports = {
    actionBar: function (message = '') {
        this.p.stateHandler.checkReady.call(this);

        if (!(message instanceof Text))
            message = new Text(message);

        this.p.sendPacket('title', {
            action: 2,
            text: JSON.stringify(message.chat)
        })
    }
}