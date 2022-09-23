module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this._chat === null)
            this._chat = Text.arrayToChat(this.array);

        return this._chat;
    }
}