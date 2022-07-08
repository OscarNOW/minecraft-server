module.exports = {
    shutdown: function () {
        this.p.intervals.forEach(interval => clearInterval(interval));
        this.p.timeouts.forEach(timeout => clearInterval(timeout));
    }
}