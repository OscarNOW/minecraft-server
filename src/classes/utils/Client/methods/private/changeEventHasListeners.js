module.exports = {
    changeEventHasListeners(type) {
        return this.p.changeEvents[type].length > 0;
    }
}