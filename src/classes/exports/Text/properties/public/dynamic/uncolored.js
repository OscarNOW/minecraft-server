module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this._uncolored === null)
            this._uncolored = Text.stringToUncolored(this.string)

        return this._uncolored;
    },
    set(val) {
        this.__reset();
        this._input = val;
        this.__emitChange();
    }
}