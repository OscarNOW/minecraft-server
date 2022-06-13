module.exports = {
    updateCanUsed: function () {
        this.p.readyStates.socketOpen = this.online;
        let canUsed = true;
        for (const val of Object.values(this.p.readyStates))
            if (!val) canUsed = false;

        this.p.canUsed = canUsed;
        if (this.p.canUsed && !this.p.joinedPacketSent && !this.p.leftPacketSent) {
            this.p.joinedPacketSent = true;

            this.server.clients.push(this);
            this.server.emit('join', this);

        } else if (!canUsed && !this.p.leftPacketSent && this.p.joinedPacketSent) {
            this.p.leftPacketSent = true;

            this.server.clients = this.server.clients.filter(client => client != this);
            this.emit('leave');
            this.server.emit('leave', this);
        }
    }
}