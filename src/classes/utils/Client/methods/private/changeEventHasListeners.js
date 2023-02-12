module.exports = {
    changeEventHasListeners(type) { // todo: better name
        return this.p.changeEvents[type].length > 0;
    }
}