module.exports = {
    setInterval: function (callback, time) {
        let interval = setInterval(callback, time);
        this.p.intervals.push(interval);
    }
}