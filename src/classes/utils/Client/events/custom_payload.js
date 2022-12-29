const { parseProtocol } = require('../../../../functions/parseProtocol.js');
const { brand } = require('../properties/public/dynamic/brand.js');

module.exports = {
    custom_payload({ channel, data }) {
        if (channel === 'minecraft:brand')
            brand.set.call(this, parseProtocol('string', data));
        // else
        //not implemented
    }
}