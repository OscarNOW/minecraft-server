const { getBlockStateId } = require('../../functions/getBlockStateId.js');

class Block {
    constructor(name, state, { x, y, z }) {
        this._block = name;
        this._state = state;
        this._stateId = null;

        this.x = x;
        this.y = y;
        this.z = z;
    }

    get stateId() {
        if (this._stateId === null)
            this._stateId = getBlockStateId(this.block, this.state);

        return this._stateId;
    }

    get block() {
        return this._block;
    }

    get state() {
        return this._state;
    }
}

module.exports = Block;