module.exports = function (name, packet) {
    this.p.client.write(name, packet)
}