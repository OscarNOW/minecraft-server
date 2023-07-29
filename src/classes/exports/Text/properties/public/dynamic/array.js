module.exports = {
    get() {
        const Text = require('../../../../Text.js');

        let inp = this.p._input;
        if (inp !== null)
            if (typeof inp === 'string') {
                this.p.reset();
                this.p._array = Text.stringToArray(inp);
            } else {
                this.p.reset();
                this.p._array = Text.parseArray(inp);
            }

        return this.p._array;
    },
    set(val) {
        this.p.reset();
        this.p._input = val;
        this.p.emitChange();
    }
}