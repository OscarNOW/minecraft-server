module.exports = {
    setInterval(callback, time) {
        let interval = setInterval(callback, time);
        this.p.intervals.push(interval);
    }
}