const { ProtoDef, Parser } = require('protodef');
const { protocol } = require('../functions/loader/data.js');

const proto = new ProtoDef();
proto.addProtocol(protocol, []);

let parsers = {};

module.exports = {
    parseProtocol(type, data) {
        if (!parsers[type])
            parsers[type] = new Parser(proto, type);

        return parsers[type].parsePacketBuffer(data).data;
    }
}