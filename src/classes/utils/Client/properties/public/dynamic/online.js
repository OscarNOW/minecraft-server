module.exports = {
    online: {
        get: function () {
            return this.p.client.socket.readyState == 'open';
        }
    }
}