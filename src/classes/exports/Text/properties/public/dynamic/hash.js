const crypto = require('crypto');

module.exports = {
    get() {
        if (this.p._hash === null)
            this.p._hash = crypto.createHash('sha256').update(JSON.stringify(this.array)).digest('base64');

        return this.p._hash;
    }
}