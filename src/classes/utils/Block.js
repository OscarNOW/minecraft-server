class Block {
    constructor(block, state, { x, y, z }, updateCallback) {
        this._block = block;
        this._state = state;
        this.updateCallback = updateCallback;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get block() {
        return this._block;
    }

    get state() {
        return this._state;
    }

    set block(value) {
        this._block = value;
        this.updateCallback(this);
    }

    set state(value) {
        this._state = value;
        this.updateCallback(this);
    }
}

module.exports = Block;