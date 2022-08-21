module.exports = {
    chat: function ({ message }) {
        this.p.emit('chat', message);
    }
}