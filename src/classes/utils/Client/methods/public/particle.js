const { particles } = require('../../../../../functions/loader/data.js');

module.exports = function (particleName, visibleFromFar, particleAmount, { x, y, z }, spread) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!particles.find(({ name }) => name === particleName))
        throw new Error(`Unknown particle name "${particleName}"`);

    if (!particles.find(({ name }) => name === particleName).requireData)
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
    else
        throw new Error('Only noDataParticles are currently implemented, got a dataParticle instead');


    // else if (['block', 'block_marker', 'falling_dust'].includes(particleName))
    //not implemented
    /*
    see /temp/prismarineType/particleData.jsonc
    data: {
        blockState: getBlockId(data1)
    }

    block: only barrier??
    block_marker: kicks client: 'expected text to be a string, was an object'
    falling_dust: kicks client: 'expected text to be a string, was an object'
    */

    // else if (particleName === 'dust')
    //not implemented
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

    // else if (particleName === 'item')
    //not implemented
    /*
    see /temp/prismarineType/particleData.jsonc
    data: {
        present: true,
        itemId: items[data1].id,
        itemCount: data2
    }

    kicks client: 'expected text to be a string. was an object'
    */

    // else if (particleName === 'vibration') //Not in prismarine documentation
    //not implemented

}