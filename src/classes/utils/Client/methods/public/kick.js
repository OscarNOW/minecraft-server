const Text = require('../../../../exports/Text.js');

module.exports = function (reason) {
    this.p.stateHandler.checkReady.call(this);

    if (!(reason instanceof Text))
        reason = new Text(reason);

    this.p.client.end(0, JSON.stringify(reason.chat));
}