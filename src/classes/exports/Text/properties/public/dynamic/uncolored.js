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

        if (this._string === null)
            this._string = Text.arrayToString(this._array)

        if (this._uncolored === null)
            this._uncolored = Text.stringToUncolored(this._string)

        return this._uncolored;
    },
    set(val) {
        this.__reset();
        this._input = val;
    }
}