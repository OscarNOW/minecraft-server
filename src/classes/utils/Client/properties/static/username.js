module.exports = {
    username: function () {
        return this[this.ps.client].username;
    }
}