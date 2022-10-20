module.exports = {
    mpOn(name, callback) {
        if (!this.p.mpEvents) this.p.mpEvents = {};
        if (!this.p.mpEvents[name]) this.p.mpEvents[name] = [];

        this.p.mpEvents[name].push({ callback });
    }
}