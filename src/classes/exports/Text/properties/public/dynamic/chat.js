module.exports = {
    get() {
        if (this.p._chat === null)
            this.p._chat = this.prototype.arrayToChat(this.array);

        return this.p._chat;
    }
}