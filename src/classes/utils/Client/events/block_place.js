const faces = Object.fromEntries(
    require('../../../../functions/loader/data.js').blockFaces.map((name, ind) => [ind, name])
);

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

        //todo: update Client blocks, see block_dig for reference

        this.p.emit('blockPlace', {
            clickedLocation,
            clickedFace,
            isMainHand,
            headInsideBlock: insideBlock
        });
    }
}