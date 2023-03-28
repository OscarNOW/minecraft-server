const CustomError = require('../../CustomError.js');
const Block = require('../../Block.js');

const faces = Object.fromEntries(
    require('../../../../functions/loader/data.js').blockFaces.map((name, ind) => [ind, name])
);
const chunkSize = require('../../../../functions/loader/data.js').chunkSize;

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
            const oldBlock = this.chunks.find(({ blocks, x: chunkX, z: chunkZ }) => {

                const xOffset = chunkX * ((chunkSize.x.max - chunkSize.x.min) + 1);
                const yOffset = 0;
                const zOffset = chunkZ * ((chunkSize.z.max - chunkSize.z.min) + 1);

                const newX = x - xOffset;
                const newY = y - yOffset;
                const newZ = z - zOffset;

                return Boolean(blocks[newX]?.[newY]?.[newZ])

            })?.blocks?.[x]?.[y]?.[z];

            this.setBlock('air', { x, y, z });

            this.p.emit('blockBreak', { x, y, z }, oldBlock ?? new Block('air', { x, y, z }, {}));
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