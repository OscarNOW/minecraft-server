module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        if (this.p._uncolored === null)
            this.p._uncolored = Text.stringToUncolored(this.string)

        return this.p._uncolored;
    },
    set(val) {
        this.p.reset();
        this.p._input = val;
        this.p.emitChange();
    }
}