module.exports = {
    online: {
        get() {
            return this.p.client.socket.readyState === 'open';
        }
    }
}