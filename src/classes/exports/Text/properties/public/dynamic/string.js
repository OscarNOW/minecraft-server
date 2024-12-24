module.exports = {
    get() {
        if (this.p._string === null)
            this.p._string = this.prototype.arrayToString(this.array)

        return this.p._string;
    },
    set(input) {
        this.p.reset();

        // we set array instead of string, because like this the string will be parsed
        this.p._array = this.prototype.stringToArray(input);
        this.p.emitChange();
    }
}