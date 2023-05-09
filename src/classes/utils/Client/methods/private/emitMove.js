const { onGround } = require('../../properties/public/dynamic/onGround.js');
const { position } = require('../../properties/public/dynamic/position.js');

const { chunkSize } = require('../../../../../functions/loader/data.js');

module.exports = {
    emitMove(info) {
        if (!this.p.positionSet)
            return;

        const oldPosition = this.p._position.raw;

        let oldChunk = {
            x: Math.floor(this.position.x / (chunkSize.x.max - chunkSize.x.min)),
            z: Math.floor(this.position.z / (chunkSize.z.max - chunkSize.z.min))
        }

        let oldY = parseInt(this.position.y);

        let changed = false;
        for (const val of [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ])
            if (info[val] !== undefined && this.p._position[val] !== info[val]) {
                changed = true;
                this.p._position.setRaw(val, info[val]);
            }

        onGround.set.call(this, info.onGround);

        let newChunk = {
            x: Math.floor(this.position.x / (chunkSize.x.max - chunkSize.x.min)),
            z: Math.floor(this.position.z / (chunkSize.z.max - chunkSize.z.min))
        }

        let newY = parseInt(this.position.y);

        let viewPositionUpdate = false;
        if (newChunk.x !== oldChunk.x) viewPositionUpdate = true;
        if (newChunk.z !== oldChunk.z) viewPositionUpdate = true;
        if (oldY !== newY) viewPositionUpdate = true;

        if (viewPositionUpdate)
            this.p.sendPacket('update_view_position', {
                chunkX: newChunk.x,
                chunkZ: newChunk.z
            })

        if (changed) {
            position.update.call(this, this.p._position.raw);
            this.p.emitChange('position', oldPosition);
        }
    }
}