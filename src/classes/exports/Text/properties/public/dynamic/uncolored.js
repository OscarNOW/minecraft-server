module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._uncolored === null)
            this.p._uncolored = Text.stringToUncolored(this.string)

        return this.p._uncolored;
    },
    set(input) {
        const Text = require('../../../../Text.js');

        this.p.reset();

        // we set array instead of string, because like this the string will be parsed
        this.p._array = Text.stringToArray(input);
        this.p.emitChange();
    }
}