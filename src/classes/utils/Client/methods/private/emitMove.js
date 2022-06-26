module.exports = {
    emitMove: function (info) {
        if (!this.p.positionSet)
            return;

        let oldChunk = {
            x: Math.floor(this.position.x / 16),
            z: Math.floor(this.position.z / 16)
        }

        let oldY = parseInt(this.position.y);

        let changed = false;
        [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ].forEach(val => {
            if (info[val] !== undefined && this.p._position[val] != info[val]) {
                changed = true;
                this.p._position.setRaw(val, info[val]);
            }
        });

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

        if (changed)
            this.p.emitObservable('position');
    }
}