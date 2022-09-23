module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this._string === null)
            this._string = Text.arrayToString(this.array)

        return this._string;
    },
    set(val) {
        this.__reset();
        this._input = val;
    }
}