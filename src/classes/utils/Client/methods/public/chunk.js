module.exports = {
    chunk: function (chunk, { x, z }) {
        if (!this.p.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        this.p.sendPacket('map_chunk', {
            x,
            z,
            groundUp: true,
            biomes: chunk._chunk.dumpBiomes !== undefined ? chunk._chunk.dumpBiomes() : undefined,
            heightmaps: {
                type: 'compound',
                name: '',
                value: {}
            },
            bitMap: chunk._chunk.getMask(),
            chunkData: chunk._chunk.dump(),
            blockEntities: []
        })
    }
}