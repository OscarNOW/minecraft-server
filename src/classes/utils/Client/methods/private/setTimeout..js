module.exports = {
    setTimeout: function (callback, delay) {
        let timeout = setTimeout(() => {
            this.p.timeouts = this.p.timeouts.filter(a => a !== timeout);
            callback();
        }, delay);

        this.p.timeouts.push(timeout);
    }
}