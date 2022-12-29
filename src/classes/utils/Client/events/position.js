module.exports = {
    position(i) {
        return this.p.emitMove.call(this, i);
    },
    position_look(i) {
        return this.p.emitMove.call(this, i);
    },
    look(i) {
        return this.p.emitMove.call(this, i);
    },
    flying(i) {
        return this.p.emitMove.call(this, i);
    }
}