module.exports = {
    uuid: function () {
        return this[this.ps.client].uuid;
    }
}