const { particles } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (particleName, visibleFromFar, particleAmount, { x, y, z }, spread) {
    this.p.stateHandler.checkReady.call(this);

    if (!particles[particleName])
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `particleName in  <${this.constructor.name}>.particle(${require('util').inspect(particleName)}, ..., ..., ..., ...)  `, {
            got: particleName,
            expectationType: 'value',
            expectation: Object.keys(particles)
        }, this.demo))

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
        red: data1.r,
        green: data1.g,
        blue: data1.b,
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