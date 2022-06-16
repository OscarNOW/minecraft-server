const { Client } = require('../utils/Client');

const protocolVersions = require('../../data/protocolVersions.json')
const serverVersion = require('../../data/version.json');

const mc = require('minecraft-protocol');
const endianToggle = require('endian-toggle')
const { EventEmitter } = require('events');

const events = Object.freeze([
    'join',
    'leave'
])

let clientEarlyInformation = new WeakMap();
let clientLegacyPing = new WeakMap();

class Server extends EventEmitter {
    constructor({ serverList, wrongVersionConnect }) {
        super();

        this.serverList = serverList;
        this.wrongVersionConnect = wrongVersionConnect;
        this.clients = [];

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version: serverVersion,
            motd: '',
            maxPlayers: 0,
            beforePing: (response, client) => {
                let info = this.serverList({ ...clientEarlyInformation.get(client), legacy: clientLegacyPing.get(client) });
                let infoVersion = info.version?.correct ?? serverVersion;

                let playerHover = [];
                if (info.players.hover === undefined)
                    playerHover = undefined;
                else if (typeof info.players.hover == 'string')
                    playerHover = info.players.hover.split('\n').map(val => {
                        return { name: `${val}`, id: '00000000-0000-4000-8000-000000000000' }
                    })
                else
                    for (const value of Object.values(info.players.hover))
                        playerHover.push({ name: value.name, id: value.uuid })

                return {
                    version: {
                        name: `${info.version?.wrongText ?? infoVersion}`,
                        protocol: protocolVersions.find(a => a.legacy == false && a.version == infoVersion).protocol ?? 0
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: playerHover
                    },
                    description: `${info.description}` ?? ''
                }
            },
            hideErrors: true
        })

        this.server.on('connection', client => {
            let clientState = null;

            client.on('packet', ({ payload } = {}, { name, state } = {}, _, buffer) => {
                if (
                    name == 'legacy_server_list_ping' &&
                    state == 'handshaking' &&
                    payload == 1
                )
                    handleLegacyPing(buffer, client, this.serverList)
            })

            client.on('state', state => clientState = state)

            client.on('set_protocol', ({ protocolVersion, serverHost, serverPort }) => {
                const isLegacy = serverHost == '';

                clientEarlyInformation.set(client, {
                    ip: client.socket.remoteAddress,
                    version: isLegacy ? 'legacy' : (protocolVersions.find(a => a.legacy == false && a.protocol == protocolVersion)?.version || protocolVersions.find(a => a.legacy == true && a.protocol == protocol)?.version),
                    connection: {
                        host: isLegacy ? null : serverHost,
                        port: isLegacy ? null : serverPort
                    }
                });
                clientLegacyPing.set(client, false)

                if ((clientState == 'login' && clientEarlyInformation.get(client).version != serverVersion) || isLegacy) { //Check for wrongVersion doesn't work when legacy
                    let endReason = `${this.wrongVersionConnect({ ...clientEarlyInformation.get(client), legacy: isLegacy })}`;

                    if (typeof endReason == 'string')
                        if (isLegacy) {
                            const buffer = Buffer.alloc(2);
                            buffer.writeUInt16BE(endReason.length);

                            const responseBuffer = Buffer.concat([Buffer.from('ff', 'hex'), buffer, endianToggle(Buffer.from(endReason, 'utf16le'), 16)])

                            return client.socket.write(responseBuffer)
                        } else
                            client.end(endReason)
                    else if (endReason !== null)
                        throw new Error(`Unknown typeof return from wrongVersionConnect, expected string or null, got "${typeof endReason}" (${endReason})`)
                }

            })
        })

        this.server.on('login', async client => {
            new Client(client, this, clientEarlyInformation.get(client).version);
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

function hexToString(hex) {
    let out = '';
    for (let ii = 0; ii < hex.length; ii += 2)
        out += String.fromCharCode(parseInt(hex.substr(ii, 2), 16));

    return out.split('\x00').join('');
}

function hexToNumber(hex) {
    return parseInt(hex, 16);
}

function handleLegacyPing(request, client, serverList) {
    respondToLegacyPing(parseLegacyPing(request), client, serverList);
}

function respondToLegacyPing({ protocol, hostname, port }, client, serverList) {
    clientEarlyInformation.set(client, {
        ip: client.socket.remoteAddress,
        version: protocol !== null ? (protocolVersions.find(a => a.legacy == true && a.protocol == protocol)?.version || protocolVersions.find(a => a.legacy == false && a.protocol == protocol)?.version) : null,
        connection: {
            host: hostname,
            port
        }
    })
    clientLegacyPing.set(client, true)

    let info = serverList({ ...clientEarlyInformation.get(client), legacy: clientLegacyPing.get(client) });
    let infoVersion = info.version?.correct ?? serverVersion;

    const responseString = '\xa7' + [1,
        parseInt(protocolVersions.find(a => a.legacy == true && a.version == infoVersion)?.protocol ?? 127),
        `${info.version?.wrongText ?? infoVersion}`,
        `${info.description ?? ''}`,
        `${info.players.online}`,
        `${info.players.max}`
    ].join('\0');

    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(responseString.length);

    const responseBuffer = Buffer.concat([Buffer.from('ff', 'hex'), buffer, endianToggle(Buffer.from(responseString, 'utf16le'), 16)])
    client.socket.write(responseBuffer)
}

function parseLegacyPing(requestLeft) {
    requestLeft = requestLeft.toString('hex').split('');
    let request = [];

    /* 0 */ request.push(requestLeft.splice(0, 2).join('')) //fe
    /* 1 */ request.push(hexToNumber(requestLeft.splice(0, requestLeft.join('').indexOf('fa')).join(''))) //payload
    /* 2 */ request.push(requestLeft.splice(0, 2).join('')) //fa

    if (requestLeft.length == 0) return { protocol: null, hostname: null, port: null } //The client didn't send any information

    /* 3 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //000b (=11) length of following string
    /* 4 */ request.push(hexToString(requestLeft.splice(0, request[3] * 4).join(''))) // MC|PingHost
    /* 5 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //length of rest of request
    /* 6 */ request.push(hexToNumber(requestLeft.splice(0, 2).join(''))) //protocol version
    /* 7 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //length of following string
    /* 8 */ request.push(hexToString(requestLeft.splice(0, request[7] * 4).join(''))) //hostname
    /* 9 */ request.push(hexToNumber(requestLeft.splice(0, 8).join(''))) //port

    return {
        protocol: request[6],
        hostname: request[8],
        port: request[9]
    }
}



module.exports = Object.freeze({ Server });