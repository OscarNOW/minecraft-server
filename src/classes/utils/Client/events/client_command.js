module.exports = {
    client_command: function ({ actionId }) {
        if (actionId === 0)
            this.p.emit('respawn');
        // else
        // not implemented
    }
}