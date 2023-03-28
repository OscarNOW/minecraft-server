const CustomError = require('../../CustomError.js');
const Block = require('../../Block.js');

const faces = Object.fromEntries(
    require('../../../../functions/loader/data.js').blockFaces.map((name, ind) => [ind, name])
);

module.exports = {
    block_dig({ status, location: { x, y, z }, face }) {
        if (status === 0)
            if (faces[face])
                this.p.emit('digStart', { x, y, z }, faces[face])
            else
                this.p.emitError(new CustomError('expectationNotMet', 'client', `face in  <remote ${this.constructor.name}>.block_dig({ face: ${require('util').inspect(face)} })  `, {
                    got: face,
                    expectationType: 'value',
                    expectation: Object.keys(faces)
                }, null, { server: this.server, client: this }))

        else if (status === 1)
            this.p.emit('digCancel', { x, y, z })
        else if (status === 2) {
            const chunkX = Math.floor(x / 16);
            const chunkZ = Math.floor(z / 16);

            const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);

            let chunkRelativeX = x % 16; //todo: use chunkSize instead of 16
            let chunkRelativeY = y;
            let chunkRelativeZ = z % 16; //todo: use chunkSize instead of 16

            if (chunkRelativeX < 0) chunkRelativeX += 16;
            if (chunkRelativeY < 0) chunkRelativeY += 16;
            if (chunkRelativeZ < 0) chunkRelativeZ += 16;

            const oldBlock = chunk.blocks[chunkRelativeX][chunkRelativeY][chunkRelativeZ];

            chunk.checkNewBlock('air', { x: chunkRelativeX, y: chunkRelativeY, z: chunkRelativeZ });
            chunk.updateBlock('air', { x: chunkRelativeX, y: chunkRelativeY, z: chunkRelativeZ }, {});

            this.p.emit('blockBreak', { x, y, z }, oldBlock ?? new Block('air', {}, { x, y, z }));
        } else if (status === 3)
            this.p.emit('itemDrop', true)
        else if (status === 4)
            this.p.emit('itemDrop', false)
        else if (status === 5)
            throw new Error('Not implemented')
        else if (status === 6)
            this.p.emit('itemHandSwap')
        else
            this.p.emitError(new CustomError('expectationNotMet', 'client', `status in  <remote ${this.constructor.name}>.block_dig({ status: ${require('util').inspect(status)} })  `, {
                got: status,
                expectationType: 'value',
                expectation: [0, 1, 2, 3, 4, 5, 6]
            }, null, { server: this.server, client: this }))
    }
}