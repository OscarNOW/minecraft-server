module.exports = {
    chat: function ({ message }) {
        this.emit('chat', message);
    }
}