const particles = require('../../../../../data/particles.json');

module.exports = {
    particle: function (particleName, visibleFromFar, particleAmount, { x, y, z }, spread) {
        if (!this.p.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!particles[particleName]) throw new Error(`Unknown particleName "${particleName}" (${typeof particleName})`)

        if (!particles[particleName].requireData)
            this.p.sendPacket('world_particles', {
                particleId: particles[particleName].id,
                longDistance: visibleFromFar,
                x,
                y,
                z,
                offsetX: spread.x,
                offsetY: spread.y,
                offsetZ: spread.z,
                particleData: 0,
                particles: particleAmount
            })
        else if (['block', 'block_marker', 'falling_dust'].includes(particleName))
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            blockState: getBlockId(data1)
        }

        block: only barrier??
        block_marker: kicks client: 'expected text to be a string, was an object'
        falling_dust: kicks client: 'expected text to be a string, was an object'
        */

        else if (particleName == 'dust')
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            red: data1.red,
            green: data1.green,
            blue: data1.blue,
            scale: data2
        }

        kicks client: 'expected text to be a string. was an object'
        */

        else if (particleName == 'item')
            throw new Error('Not implemented')
        /*
        see /temp/prismarineType/particleData.jsonc
        data: {
            present: true,
            itemId: items[data1].id,
            itemCount: data2
        }
        
        kicks client: 'expected text to be a string. was an object'
        */

        else if (particleName == 'vibration') //Not in prismarine documentation
            throw new Error('Not implemented')

    }
}