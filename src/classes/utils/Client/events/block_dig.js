const { CustomError } = require('../../CustomError.js')

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
        if (status == 0)
            if (faces[face])
                this.emit('digStart', { x, y, z }, faces[face])
            else
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'client', [
                        ['', 'face', ''],
                        ['in the event ', 'block_dig', '']
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: face,
                        expectationType: 'value',
                        expectation: Object.keys(faces)
                    }).toString()

        else if (status == 1)
            this.emit('digCancel', { x, y, z })
        else if (status == 2)
            this.emit('blockBreak', { x, y, z })
        else if (status == 3)
            this.emit('itemDrop', true)
        else if (status == 4)
            this.emit('itemDrop', false)
        else if (status == 5)
            throw new Error('Not implemented')
        else if (status == 6)
            this.emit('itemHandSwap')
        else
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'status', ''],
                    ['in the event ', 'block_dig', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: status,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6]
                }).toString()
    }
}