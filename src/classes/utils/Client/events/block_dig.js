const CustomError = require('../../CustomError.js');
const Block = require('../../Block.js');

const faces = Object.fromEntries(
    require('../../../../functions/loader/data.js').blockFaces.map((name, ind) => [ind, name])
);

const { chunkSize } = require('../../../../functions/loader/data.js');

module.exports = {
    block_dig({ status, location: { x, y, z }, face }) {
        if (status === 0)
            if (faces[face]) {
                this.p.emit('digStart', { x, y, z }, faces[face])

                if (this.gamemode === 'creative') //normal blockBreak event doesn't get emitted when in creative mode
                    emitBlockBreak.call(this, { x, y, z });
            } else
                this.p.emitError(new CustomError('expectationNotMet', 'client', `face in  <remote ${this.constructor.name}>.block_dig({ face: ${require('util').inspect(face)} })  `, {
                    got: face,
                    expectationType: 'value',
                    expectation: Object.keys(faces)
                }, null, { server: this.server, client: this }))

        else if (status === 1)
            this.p.emit('digCancel', { x, y, z })
        else if (status === 2)
            emitBlockBreak.call(this, { x, y, z })
        else if (status === 3)
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

function emitBlockBreak({ x, y, z }) {
    const chunkX = Math.floor(x / (chunkSize.x.max - chunkSize.x.min));
    const chunkZ = Math.floor(z / (chunkSize.z.max - chunkSize.z.min));

    const chunk = this.chunks.find(({ x, z }) => x === chunkX && z === chunkZ);

    let chunkRelativeX = x % (chunkSize.x.max - chunkSize.x.min);
    let chunkRelativeY = y % (chunkSize.y.max - chunkSize.y.min);
    let chunkRelativeZ = z % (chunkSize.z.max - chunkSize.z.min);

    if (chunkRelativeX < 0) chunkRelativeX += (chunkSize.x.max - chunkSize.x.min);
    if (chunkRelativeY < 0) chunkRelativeY += (chunkSize.y.max - chunkSize.y.min);
    if (chunkRelativeZ < 0) chunkRelativeZ += (chunkSize.z.max - chunkSize.z.min);

    const oldBlock = chunk.blocks[chunkRelativeX][chunkRelativeY][chunkRelativeZ];

    chunk.updateBlock('air', { x: chunkRelativeX, y: chunkRelativeY, z: chunkRelativeZ }, {});

    this.p.emit('blockBreak', { x, y, z }, oldBlock ?? new Block('air', {}, { x, y, z }));
}