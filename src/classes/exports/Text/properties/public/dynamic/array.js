module.exports = {
    get() {
        if (this.p._array)
            return this.p._array;

        if (this.p._string) {
            this.p._array = this.prototype.stringToArray(this.p._string);
            return this.p._array;
        }

        throw new Error('Getting array in Text, but array and string aren\'t set');
    },
    set(input) {
        this.p.reset();
        this.p._array = this.prototype.parseArray(input);
        this.p.emitChange();
    }
}