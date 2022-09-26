module.exports = {
    position: function (i) {
        return this.p.emitMove.call(this, i);
    },
    position_look: function (i) {
        return this.p.emitMove.call(this, i);
    },
    look: function (i) {
        return this.p.emitMove.call(this, i);
    },
    flying: function (i) {
        return this.p.emitMove.call(this, i);
    }
}

throw new Error();

console.log(10)