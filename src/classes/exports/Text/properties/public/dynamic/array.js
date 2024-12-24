module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._array)
            return this.p._array;

        if (this.p._string) {
            this.p._array = Text.stringToArray(this.p._string);
            return this.p._array;
        }

        throw new Error('Getting array in Text, but array and string aren\'t set');
    },
    set(input) {
        const Text = require('../../../../Text.js');

        this.p.reset();
        this.p._array = Text.parseArray(input);
        this.p.emitChange();
    }
}