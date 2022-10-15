class Block {
    constructor(name, state, { x, y, z }, updateCallback) {
        this._block = { name, state };
        this._state = state;
        this.updateCallback = updateCallback;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get block() {
        return this._block;
    }

    set block({ name, state }) {
        this._block = { name, state };
        this.updateCallback(this);
    }
}

module.exports = Block;