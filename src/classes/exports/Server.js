const { versions } = require('../../functions/loader/data.js')
const settings = require('../../settings.json')

const mc = require('minecraft-protocol');
const endianToggle = require('endian-toggle')
const { EventEmitter } = require('events');
const imageSize = require('image-size');

const { Client } = require('../utils/Client.js');
const { CustomError } = require('../utils/CustomError.js');

const events = Object.freeze([
    'join',
    'leave'
])

let clientEarlyInformation = new WeakMap();
let clientLegacyPing = new WeakMap();

class Server extends EventEmitter {
    constructor({ serverList, wrongVersionConnect, defaultClientProperties } = {}) {
        super();

        this.serverList = serverList ?? (() => ({}));
        this.wrongVersionConnect = wrongVersionConnect ?? (() => settings.defaults.serverList.wrongVersionConnectMessage.replace('{version}', settings.version));
        this.defaultClientProperties = defaultClientProperties;
        this.clients = [];

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version: settings.version,
            motd: settings.defaults.serverList.motd,
            maxPlayers: settings.defaults.serverList.maxPlayers,
            keepAlive: false,
            hideErrors: true,
            beforePing: (response, client) => {
                let info = Object.assign({}, this.serverList({ ...clientEarlyInformation.get(client), legacy: clientLegacyPing.get(client) }));
                let infoVersion = info.version?.correct ?? settings.version;

                if (!info) info = {};
                if (!info.players) info.players = {};
                if (info.players.max === undefined) info.players.max = settings.defaults.serverList.maxPlayers;
                if (info.players.online === undefined) info.players.online = this.clients.length;
                if (info.description === undefined) info.description = settings.defaults.serverList.motd;

                let playerHover = [];
                if (info?.players?.hover === undefined)
                    playerHover = undefined;
                else if (typeof info?.players?.hover == 'string')
                    playerHover = info.players.hover.split('\n').map(val => {
                        return { name: `${val}`, id: '00000000-0000-4000-8000-000000000000' }
                    })
                else
                    for (const value of Object.values(info.players.hover))
                        playerHover.push({ name: value.name, id: value.uuid })

                if (info.favicon) {
                    let imageInfo = imageSize(info.favicon);

                    if (imageInfo.type != 'png')
                        throw new CustomError('expectationNotMet', 'libraryUser', [
                            ['', 'image type', ''],
                            ['in the function "', 'serverList', '"'],
                            ['in the ', 'constructor', ' of'],
                            ['the class ', this.constructor.name, ''],
                        ], {
                            got: imageInfo.type,
                            expectationType: 'value',
                            expectation: ['png']
                        }, this.constructor).toString()

                    if (imageInfo.width != 64 || imageInfo.height != 64)
                        throw new CustomError('expectationNotMet', 'libraryUser', [
                            ['', 'image dimensions', ''],
                            ['in the function "', 'serverList', '"'],
                            ['in the ', 'constructor', ' of'],
                            ['the class ', this.constructor.name, ''],
                        ], {
                            got: `${imageInfo.width}x${imageInfo.height}`,
                            expectationType: 'value',
                            expectation: ['64x64']
                        }, this.constructor).toString()

                }

                return {
                    version: {
                        name: `${info?.version?.wrongText ?? infoVersion}`,
                        protocol: versions.find(a => a.legacy == false && a.version == infoVersion).protocol ?? 0
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: playerHover
                    },
                    description: { //Chat component
                        text: `${info.description}`
                    },
                    favicon: info.favicon ? `data:image/png;base64,${info.favicon.toString('base64')}` : undefined
                }
            }
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
                    version: isLegacy ?
                        'legacy' :
                        (versions.find(a => a.legacy == false && a.protocol == protocolVersion)?.version ||
                            versions.find(a => a.legacy == true && a.protocol == protocolVersion)?.version),
                    connection: {
                        host: isLegacy ? null : serverHost,
                        port: isLegacy ? null : serverPort
                    }
                });
                clientLegacyPing.set(client, false)

                if ((clientState == 'login' && clientEarlyInformation.get(client).version != settings.version) || isLegacy) { //Check for wrongVersion doesn't work when legacy
                    let endReason = this.wrongVersionConnect({ ...clientEarlyInformation.get(client), legacy: isLegacy });

                    if (typeof endReason == 'string')
                        if (isLegacy) {
                            const buffer = Buffer.alloc(2);
                            buffer.writeUInt16BE(endReason.length);

                            const responseBuffer = Buffer.concat([Buffer.from('ff', 'hex'), buffer, endianToggle(Buffer.from(endReason, 'utf16le'), 16)])

                            return client.socket.write(responseBuffer)
                        } else
                            client.end(endReason)
                    else if (endReason !== null)
                        throw new CustomError('expectationNotMet', 'libraryUser', [
                            ['', 'return from wrongVersionConnect', ''],
                            ['in the class ', this.constructor.name, ''],
                        ], {
                            got: endReason,
                            expectationType: 'type',
                            expectation: 'string | null'
                        }, this.constructor).toString()
                }

            })
        })

        this.server.on('login', async client => {
            new Client(client, this, clientEarlyInformation.get(client), this.defaultClientProperties);
        });

    }

    addListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'addListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.addListener).toString()

        return super.addListener(event, callback);
    }

    on(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'on', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on).toString()

        return super.on(event, callback);
    }

    once(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'once', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.once).toString()

        return super.once(event, callback);
    }

    prependListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'prependListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.prependListener).toString()

        return super.prependListener(event, callback);
    }

    prependOnceListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'prependOnceListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.prependOnceListener).toString()

        return super.prependOnceListener(event, callback);
    }

    off(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'off', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.off).toString()

        return super.off(event, callback);
    }

    removeListener(event, callback) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'removeListener', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.removeListener).toString()

        return super.removeListener(event, callback);
    }

    removeAllListeners(event) {
        if (event !== undefined && !events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'removeAllListeners', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.removeAllListeners).toString()

        return super.removeAllListeners(event);
    }

    rawListeners(event) {
        if (!events.includes(event))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'event', ''],
                ['in the function "', 'rawListeners', '"'],
                ['in the class ', this.constructor.name, '']
            ], {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.rawListeners).toString()

        return super.rawListeners(event);
    }

    close() {
        setTimeout(() => {
            this.clients.forEach(client => client.p.shutdown());
            this.server.close();
        }, 10)
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
        version: protocol !== null ? (versions.find(a => a.legacy == true && a.protocol == protocol)?.version || versions.find(a => a.legacy == false && a.protocol == protocol)?.version) : null,
        connection: {
            host: hostname,
            port
        }
    })
    clientLegacyPing.set(client, true)

    let info = serverList({ ...clientEarlyInformation.get(client), legacy: clientLegacyPing.get(client) });
    let infoVersion = info.version?.correct ?? settings.version;

    const responseString = '\xa7' + [1,
        parseInt(versions.find(a => a.legacy == true && a.version == infoVersion)?.protocol ?? 127),
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



module.exports = Server;