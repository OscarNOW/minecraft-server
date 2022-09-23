module.exports = {
    emitMove(info) {
        if (!this.p.positionSet)
            return;

        let oldChunk = {
            x: Math.floor(this.position.x / 16),
            z: Math.floor(this.position.z / 16)
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
            if (info[val] !== undefined && this.p._position[val] != info[val]) {
                changed = true;
                this.p._position.setRaw(val, info[val]);
            }

        require('../../properties/public/dynamic/onGround.js').setPrivate.call(this, info.onGround);

        let newChunk = {
            x: Math.floor(this.position.x / 16),
            z: Math.floor(this.position.z / 16)
        }

        let newY = parseInt(this.position.y);

        let viewPositionUpdate = false;
        if (newChunk.x != oldChunk.x) viewPositionUpdate = true;
        if (newChunk.z != oldChunk.z) viewPositionUpdate = true;
        if (oldY != newY) viewPositionUpdate = true;

        if (viewPositionUpdate)
            this.p.sendPacket('update_view_position', {
                chunkX: newChunk.x,
                chunkZ: newChunk.z
            })

        if (changed) {
            require('../../properties/public/dynamic/position.js').position.update.call(this, this.p._position.raw)
            this.p.emitObservable('position');
        }
    }
}