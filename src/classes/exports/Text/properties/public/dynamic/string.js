module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._string === null)
            this.p._string = Text.arrayToString(this.array)

        return this.p._string;
    },
    set(val) {
        this.p.reset();
        this.p._input = val;
        this.p.emitChange();
    }
}