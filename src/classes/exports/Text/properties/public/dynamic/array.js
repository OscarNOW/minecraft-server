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

        return this._array;
    },
    set(val) {
        this.__reset();
        this._input = val;
    }
}