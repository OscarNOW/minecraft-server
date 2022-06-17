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
        if (status == 1 && !faces[face])
            throw new Error(`Unknown face "face" (${typeof face})`)

        if (status == 0)
            this.emit('digStart', { x, y, z }, faces[face])
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
            throw new Error(`Unknown status "${status}" (${typeof status})`)
    }
}