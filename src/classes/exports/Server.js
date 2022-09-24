const { versions } = require('../../functions/loader/data.js')
const settings = require('../../settings.json')

const mc = require('minecraft-protocol');
const endianToggle = require('endian-toggle');
const imageSize = require('image-size');
const path = require('path');

const Client = require('../utils/Client.js');
const CustomError = require('../utils/CustomError.js');

const defaultPrivate = {
    emit(name, ...args) {
        for (const { callback } of this.p.events[name])
            callback(...args);

        this.p.events[name] = this.p.events[name].filter(({ once }) => once == false);
    },
    emitError(customError) {
        if (this.p.events.error.length > 0)
            this.p.emit('error', customError);
        else
            throw customError.toString();
    }
};

const events = Object.freeze([
    'connect',
    'join',
    'leave',
    'error'
])

const privates = new WeakMap();

class Server {
    constructor({ serverList, wrongVersionConnect, defaultClientProperties } = {}) {
        this.serverList = serverList ?? (() => ({}));
        this.wrongVersionConnect = wrongVersionConnect ?? (() => settings.defaults.serverList.wrongVersionConnectMessage.replace('{version}', settings.version));
        this.defaultClientProperties = defaultClientProperties;
        this.clients = [];

        this.p.events = Object.fromEntries(events.map(event => [event, []]));
        this.p.clientInfo = new WeakMap();

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version: settings.version,
            motd: settings.defaults.serverList.motd,
            maxPlayers: settings.defaults.serverList.maxPlayers,
            keepAlive: false,
            hideErrors: true,
            beforePing: (response, client) => {
                let info = Object.assign({}, this.serverList({ ...this.p.clientInformation.get(client).clientEarlyInformation, legacy: this.p.clientInformation.get(client).clientLegacyPing }));
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
                        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `image type in  new ${this.constructor.name}({ serverList: () => ({ favicon: <typeof ${imageInfo.type}> }) })  `, {
                            got: imageInfo.type,
                            expectationType: 'value',
                            expectation: ['png']
                        }, this.constructor))

                    if (imageInfo.width != 64 || imageInfo.height != 64)
                        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `image type in  new ${this.constructor.name}({ serverList: () => ({ favicon: <dimensions of ${imageInfo.width}x${imageInfo.height}> }) })  `, {
                            got: `${imageInfo.width}x${imageInfo.height}`,
                            expectationType: 'value',
                            expectation: ['64x64']
                        }, this.constructor))

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
            this.p.clientInformation.set(client, {});

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

                this.p.clientInformation.get(client).clientEarlyInformation = {
                    ip: client.socket.remoteAddress,
                    version: isLegacy ?
                        'legacy' :
                        (versions.find(a => a.legacy == false && a.protocol == protocolVersion)?.version ||
                            versions.find(a => a.legacy == true && a.protocol == protocolVersion)?.version),
                    connection: {
                        host: isLegacy ? null : serverHost,
                        port: isLegacy ? null : serverPort
                    }
                };
                this.p.clientInformation.get(client).clientLegacyPing = false;

                if ((clientState == 'login' && this.p.clientInformation.get(client).clientEarlyInformation.version != settings.version) || isLegacy) { //Check for wrongVersion doesn't work when legacy
                    let endReason = this.wrongVersionConnect({ ...this.p.clientInformation.get(client).clientEarlyInformation, legacy: isLegacy });

                    if (typeof endReason == 'string')
                        if (isLegacy) {
                            const buffer = Buffer.alloc(2);
                            buffer.writeUInt16BE(endReason.length);

                            const responseBuffer = Buffer.concat([Buffer.from('ff', 'hex'), buffer, endianToggle(Buffer.from(endReason, 'utf16le'), 16)])

                            return client.socket.write(responseBuffer)
                        } else
                            client.end(endReason)
                    else if (endReason !== null)
                        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `endReason in  new ${this.constructor.name}({ wrongVersionConnect: () => ${require('util').inspect(endReason)} })  `, {
                            got: endReason,
                            expectationType: 'type',
                            expectation: 'string | null'
                        }, this.constructor))
                }

            })
        })

        this.server.on('login', async client => {
            new Client(client, this, this.p.clientInformation.get(client).clientEarlyInformation, this.defaultClientProperties);
        });

    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (callPath.startsWith(folderPath)) {
            if (!privates.get(this))
                privates.set(this, Object.assign({}, defaultPrivate));

            return privates.get(this);
        } else
            return this.p._p
    }

    set p(value) {
        this.p._p = value;
    }

    on(event, callback) {
        if (!events.includes(event))
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)`, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on))

        this.p.events[event].push({ callback, once: false })
    }

    once(event, callback) {
        if (!events.includes(event))
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.once(${require('util').inspect(event)}, ...)`, {
                got: event,
                expectationType: 'value',
                expectation: events
            }, this.on))

        this.p.events[event].push({ callback, once: true })
    }

    close() {
        setTimeout(() => {
            for (const client of this.clients) client.p.shutdown();
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
    this.p.clientInformation.get(client).clientEarlyInformation = {
        ip: client.socket.remoteAddress,
        version: protocol !== null ? (versions.find(a => a.legacy == true && a.protocol == protocol)?.version || versions.find(a => a.legacy == false && a.protocol == protocol)?.version) : null,
        connection: {
            host: hostname,
            port
        }
    }
    this.p.clientInformation.get(client).clientLegacyPing = true

    let info = serverList({ ...this.p.clientInformation.get(client).clientEarlyInformation, legacy: this.p.clientInformation.get(client).clientLegacyPing });
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