module.exports = {
    position: function (i) {
        return this[this.ps.emitMove].call(this, i);
    },
    position_look: function (i) {
        return this[this.ps.emitMove].call(this, i);
    },
    look: function (i) {
        return this[this.ps.emitMove].call(this, i);
    },
    flying: function (i) {
        return this[this.ps.emitMove].call(this, i);
    }
}