const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class Block {
    constructor(name, state, { x, y, z }, updateCallback) {
        this._block = { name, state };
        this._state = state;
        this._stateId = null;
        this.updateCallback = updateCallback;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get stateId() {
        if (this._stateId === null)
            this._stateId = getBlockStateId(this.block.name, this.block.state);

        return this._stateId;
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