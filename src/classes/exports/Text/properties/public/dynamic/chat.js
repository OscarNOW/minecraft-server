module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._chat === null)
            this.p._chat = Text.arrayToChat(this.array);

        return this.p._chat;
    }
}