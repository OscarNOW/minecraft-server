module.exports = function (name, packet) {
    console.warn(`<Client>.raw( is for testing purposes only. Do not use this in your code. It will be removed in the future.\nSending packet: ${name}\n`);
    this.p.client.write(name, packet)
}