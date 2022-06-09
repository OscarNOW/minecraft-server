const { Client } = require('../utils/Client');

const protocolVersions = require('../../data/protocolVersions.json')
const version = require('../../data/version.json');

const mc = require('minecraft-protocol');
const { EventEmitter } = require('events');

function getVersionFromProtocol(protocol, legacy) {
    return Object.keys(protocolVersions[legacy ? 'legacy' : 'new']).find(x => protocolVersions[legacy ? 'legacy' : 'new'][x] == protocol) ?? (legacy ? getVersionFromProtocol(protocol, false) : 'newer')
}

const events = Object.freeze([
    'join',
    'leave'
])

class Server extends EventEmitter {
    constructor({ serverList, wrongVersionConnect }) {
        super();

        this.serverList = serverList;
        this.wrongVersionConnect = wrongVersionConnect;
        this.clients = [];

        let clientInfos = new WeakMap();

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version,
            motd: '',
            maxPlayers: 0,
            beforePing: (response, client) => {

                let info = this.serverList(clientInfos.get(client));
                let pingVersion = info.version?.correct ?? version;

                let playerHover = [];
                if (info.players.hover === undefined)
                    playerHover = undefined;
                else if (typeof info.players.hover == 'string')
                    playerHover = info.players.hover.split('\n').map(val => {
                        return { name: val, id: '00000000-0000-4000-8000-000000000000' }
                    })
                else
                    for (const value of Object.values(info.players.hover))
                        playerHover.push({ name: value.name, id: value.uuid })

                return {
                    version: {
                        name: info.version?.wrongText ?? pingVersion,
                        protocol: protocolVersions.new[pingVersion] ?? 0
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: playerHover
                    },
                    description: info.description ?? ''
                }
            }
        })

        this.server.on('connection', client => {
            let clientState = null;
            let clientVersion;

            client.on('packet', (json, { size, name, state }, buffer, fullBuffer) => {
                if (
                    name == 'legacy_server_list_ping' &&
                    state == 'handshaking' &&
                    json.payload == 1
                ) {

                    function hex_to_ascii(str1) {
                        var hex = str1.toString();
                        var str = '';
                        for (var n = 0; n < hex.length; n += 2) {
                            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
                        }
                        return str;
                    }

                    let clientInf = fullBuffer.toString('hex');

                    const mcPingHost = '004d0043007c00500069006e00670048006f00730074';
                    const lengthRest = clientInf.slice(clientInf.indexOf(mcPingHost) + mcPingHost.length, clientInf.indexOf(mcPingHost) + mcPingHost.length + 4);
                    let protocol = clientInf.slice(clientInf.indexOf(mcPingHost + lengthRest) + mcPingHost.length + lengthRest.length, clientInf.indexOf(mcPingHost + lengthRest) + mcPingHost.length + lengthRest.length + 2)
                    const lengthHostname = clientInf.slice(clientInf.indexOf(mcPingHost + lengthRest + protocol) + mcPingHost.length + lengthRest.length + protocol.length, clientInf.indexOf(mcPingHost + lengthRest + protocol) + mcPingHost.length + lengthRest.length + protocol.length + 4)
                    let hostname = clientInf.slice(clientInf.indexOf(lengthRest + protocol + lengthHostname) + lengthRest.length + protocol.length + lengthHostname.length, clientInf.length - 8)
                    let port = clientInf.slice(clientInf.length - 8, clientInf.length)

                    protocol = parseInt(protocol, 16)
                    hostname = hex_to_ascii(hostname).split('\x00').join('')
                    port = parseInt(port, 16)

                    clientInfos.set(client, {
                        ip: client.socket.remoteAddress,
                        version: getVersionFromProtocol(protocol, true),
                        connection: {
                            host: hostname,
                            port
                        },
                        legacy: true
                    })

                    const endianToggle = function (buf, bits) {
                        var output = Buffer.alloc(buf.length);
                        if (bits % 8 !== 0) throw new Error('bits must be a multiple of 8');
                        var bytes = bits / 8;
                        if (buf.length % bytes !== 0) throw new Error((buf.length % bytes) + ' non-aligned trailing bytes');
                        for (var i = 0; i < buf.length; i += bytes)
                            for (var j = 0; j < bytes; j++)
                                output[i + bytes - j - 1] = buf[i + j];
                        return output;
                    };

                    let returnInfo = this.serverList(clientInfos.get(client));
                    let returnVersion = returnInfo.version?.correct ?? version;

                    const responseString = '\xa7' + [1,
                        protocolVersions.legacy[returnVersion] ?? 127,
                        returnInfo.version?.wrongText ?? returnVersion,
                        returnInfo.description ?? '',
                        `${returnInfo.players.online}`,
                        `${returnInfo.players.max}`
                    ].join('\0')
                    const b = Buffer.alloc(2);
                    b.writeUInt16BE(responseString.length);
                    const raw = Buffer.concat([Buffer.from('ff', 'hex'), b, endianToggle(Buffer.from(responseString, 'utf16le'), 16)])
                    client.socket.write(raw)
                }
            })

            client.on('state', state => {
                if (state == 'login')
                    clientState = 'login'
                else if (state == 'status')
                    clientState = 'status'
            })

            client.on('set_protocol', ({ protocolVersion, serverHost, serverPort }) => {
                clientVersion = getVersionFromProtocol(protocolVersion, false)

                clientInfos.set(client, {
                    ip: client.socket.remoteAddress,
                    version: clientVersion,
                    connection: {
                        host: serverHost,
                        port: serverPort
                    },
                    legacy: false
                });

                if (clientState == 'login' && clientVersion != version) {
                    let ret = this.wrongVersionConnect(clientInfos.get(client));
                    if (typeof ret == 'string')
                        client.end(ret)
                    else if (ret !== null)
                        throw new Error(`Unknown return from wrongVersionConnect "${ret}" (${typeof ret}). It has to be a string or null. `)
                }

            })
        })

        this.server.on('login', async client => {
            new Client(client, this, clientInfos.get(client).version);
        });

    }

    addListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.on(event, callback);
    }

    once(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event != undefined && !events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!events.includes(event)) throw new Error(`Unknown event "${event}" (${typeof event})`)
        return super.rawListeners(event);
    }

    get playerCount() {
        return this.clients.length;
    }

    close() {
        this.server.close();
    }
}

module.exports = Object.freeze({ Server });