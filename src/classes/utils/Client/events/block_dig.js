const CustomError = require('../../CustomError.js')

const faces = Object.freeze({
    0: '-Y',
    1: '+Y',
    2: '-Z',
    3: '+Z',
    4: '-X',
    5: '+X'
});

module.exports = {
    block_dig: function ({ status, location: { x, y, z }, face }) {
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
        else if (status === 2)
            this.p.emit('blockBreak', { x, y, z })
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