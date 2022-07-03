module.exports = {
    shutdown: function () {
        this.p.intervals.forEach(interval => clearInterval(interval));
    }
}