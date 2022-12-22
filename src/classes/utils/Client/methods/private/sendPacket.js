module.exports = {
    sendPacket(name, packet) {
        if (name === 'login')
            console.log(name, packet) //todo-imp: remove

        this.p.client.write(name, packet);
    }
}