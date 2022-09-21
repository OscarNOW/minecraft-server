module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        let inp = this._input;
        if (inp !== null)
            if (typeof inp == 'string') {
                this.__reset();
                this._array = Text.stringToArray(inp);
            } else {
                this.__reset();
                this._array = Text.parseArray(inp);
            }

        this._chat = Text.arrayToChat(this._array);

        return this._chat;
    }
}