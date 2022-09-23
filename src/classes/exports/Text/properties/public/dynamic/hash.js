const crypto = require('crypto');

module.exports = {
    get() {
        if (this._hash === null)
            this._hash = crypto.createHash('sha256').update(JSON.stringify(this.array)).digest('base64');

        return this._hash;
    }
}