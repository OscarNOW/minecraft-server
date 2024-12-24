module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._string === null)
            this.p._string = Text.arrayToString(this.array)

        return this.p._string;
    },
    set(input) {
        const Text = require('../../../../Text.js');

        this.p.reset();

        // we set array instead of string, because like this the string will be parsed
        this.p._array = Text.stringToArray(input);
        this.p.emitChange();
    }
}