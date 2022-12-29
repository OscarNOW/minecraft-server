module.exports = {
    chat({ message }) {
        this.p.emit('chat', message);
    }
}