module.exports = function (name, packet) {
    console.warn('This method is for testing purposes only. Do not use this in your code. It will be removed in the future.');
    this.p.client.write(name, packet)
}