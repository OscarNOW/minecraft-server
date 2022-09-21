const crypto = require('crypto');

module.exports = {
    get() {
        if (this._hash)
            return this._hash;

        this._hash = crypto.createHash('sha256').update(JSON.stringify(this.array)).digest('base64');
        return this._hash;
    }
}