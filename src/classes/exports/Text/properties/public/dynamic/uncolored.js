module.exports = {
    get() {
        if (this.p._uncolored === null)
            this.p._uncolored = this.prototype.stringToUncolored(this.string)

        return this.p._uncolored;
    },
    set(input) {
        this.p.reset();

        // we set array instead of string, because like this the string will be parsed
        this.p._array = this.prototype.stringToArray(input);
        this.p.emitChange();
    }
}