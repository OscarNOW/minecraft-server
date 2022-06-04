module.exports = {
    online: {
        get: function () {
            return this[this.ps.client].socket.readyState == 'open';
        }
    }
}