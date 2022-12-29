const faces = Object.freeze({
    0: '-Y',
    1: '+Y',
    2: '-Z',
    3: '+Z',
    4: '-X',
    5: '+X'
});

module.exports = {
    block_place({ hand, location: { x, y, z }, direction, cursorX, cursorY, cursorZ, insideBlock }) {
        //todo: check inputs and add CustomError

        //todo: get block that is being placed, add that to event callback, and update LoadedChunk with said block

        const isMainHand = hand === 0;
        const clickedFace = faces[direction];

        let clickedLocation = {
            x: x + cursorX,
            y: y + cursorY,
            z: z + cursorZ
        }

        this.p.emit('blockPlace', {
            clickedLocation,
            clickedFace,
            isMainHand,
            headInsideBlock: insideBlock
        })
    }
}