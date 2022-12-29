const { ProtoDef, Parser } = require('protodef');
const protocol = require('../data/protocol.json');

const proto = new ProtoDef();
proto.addProtocol(protocol, []);

let parsers = {};

module.exports = {
    parseProtocol: function (type, data) {
        if (!parsers[type])
            parsers[type] = new Parser(proto, type);

        return parsers[type].parsePacketBuffer(data).data;
    }
}