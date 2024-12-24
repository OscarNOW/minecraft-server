const { versions } = require('../../functions/loader/data.js');
const { compareDotSeparatedStrings } = require('../../functions/compareDotSeparatedStrings.js');
const settings = require('../../settings.json');

//lazy load minecraft-protocol
let cachedMc;
const mc = () => {
    if (cachedMc === undefined)
        cachedMc = require('minecraft-protocol');

    return cachedMc;
};

//lazy load image-size
let cachedImageSize;
const imageSize = () => {
    if (cachedImageSize === undefined)
        cachedImageSize = require('image-size');

    return cachedImageSize;
};

const endianToggle = require('endian-toggle');
const path = require('path');

const Text = require('./Text.js');

const Client = require('../utils/Client.js');

const wait = ms => new Promise(res => setTimeout(res, ms));

const defaultPrivate = {
    emit(name, ...args) {
        for (const { callback } of this.p.events[name])
            callback(...args);

        this.p.events[name] = this.p.events[name].filter(({ once }) => once === false);
    },
    emitError(customError) {
        if (this.p.events.error.length > 0)
            this.p.emit('error', customError);
        else
            throw customError.toString();
    }
};

const events = Object.freeze([
    'listening',
    'connect',
    'join',
    'leave',
    'error'
]);

const _p = Symbol('_privates');

class Server {
    constructor({ serverList, wrongVersionConnect, defaultClientProperties, proxy } = {}) {
        if (compareDotSeparatedStrings(process.versions.node, settings.maxNodeVersion) > 0)
            console.warn(`(minecraft-server) WARNING: Node.js version ${process.versions.node} is above the maximum supported version ${settings.maxNodeVersion}. Clients may be unable to join the server.`);

        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });

        for (const [key, value] of Object.entries(defaultPrivate)) {
            let newValue = value;
            if (typeof newValue === 'function')
                newValue = newValue.bind(this);

            this[_p][key] = newValue;
        };

        this.serverList = serverList ?? (() => ({}));
        this.wrongVersionConnect = wrongVersionConnect ??
            (() => settings.defaults.serverList.wrongVersionConnectMessage.replace('{version}',
                versions.find(a => a.legacy === false && a.protocol === settings.version)?.version ??
                versions.find(a => a.legacy === true && a.protocol === settings.version)?.version ??
                settings.version
            ));
        this.defaultClientProperties = defaultClientProperties;
        this.p.proxy = proxy;

        this.clients = [];
        this.p.events = Object.fromEntries(events.map(event => [event, []]));
        this.p.clientInformation = new WeakMap();

        // this will get called when <Server>.listen() is called
        this.p.listen = () => {
            this.p.listen = null;

            return new Promise(res => {
                this.p.server = mc().createServer({
                    encryption: true,
                    version: settings.version,
                    motd: settings.defaults.serverList.motd,
                    maxPlayers: settings.defaults.serverList.maxPlayers,
                    keepAlive: false,
                    hideErrors: true,
                    beforePing: (response, client) => {
                        let info = Object.assign({}, this.serverList({
                            ...this.p.clientInformation.get(client).clientEarlyInformation,
                            version: //todo: give protocolVersion instead of versionName
                                versions.find(a => a.legacy === this.p.clientInformation.get(client).clientLegacyPing && a.protocol === this.p.clientInformation.get(client).clientEarlyInformation.version)?.version ??
                                versions.find(a => a.legacy === !this.p.clientInformation.get(client).clientLegacyPing && a.protocol === this.p.clientInformation.get(client).clientEarlyInformation.version)?.version,

                            legacy: this.p.clientInformation.get(client).clientLegacyPing //todo: add legacy to clientEarlyInformation?
                        }));

                        let infoVersionWrongText = `${info.version?.wrongText ?? info.version?.correct ?? versions.find(a => a.legacy === false && a.protocol === settings.version).version}`;
                        let infoVersionProtocol = info.version?.correct ? versions.find(a => a.legacy === false && a.version === info.version.correct).protocol : settings.version;

                        //todo: use applyDefaults?
                        if (!info) info = {};
                        if (!info.players) info.players = {};
                        if (info.players.max === undefined) info.players.max = settings.defaults.serverList.maxPlayers;
                        if (info.players.online === undefined) info.players.online = this.clients.length;
                        if (info.description === undefined) info.description = settings.defaults.serverList.motd;

                        if (info.description !== undefined && !(info.description instanceof Text))
                            info.description = new Text(info.description);

                        let playerHover = [];
                        if (info?.players?.hover === undefined)
                            playerHover = undefined;
                        else if (typeof info?.players?.hover === 'string')
                            playerHover = info.players.hover.split('\n').map(val => {
                                return { name: `${val}`, id: '00000000-0000-4000-8000-000000000000' }
                            })
                        else
                            for (const value of Object.values(info.players.hover))
                                playerHover.push({ name: value.name, id: value.uuid })

                        if (info.favicon) {
                            let imageInfo = imageSize()(info.favicon);

                            if (imageInfo.type !== 'png')
                                throw new Error(`Favicon image type must be png, currently is ${imageInfo.type}`);

                            if (imageInfo.width !== 64 || imageInfo.height !== 64)
                                throw new Error(`Favicon image must be 64x64, currently is ${imageInfo.width}x${imageInfo.height}`);
                        };

                        return {
                            version: {
                                name: infoVersionWrongText,
                                protocol: infoVersionProtocol
                            },
                            players: {
                                online: info.players.online,
                                max: info.players.max,
                                sample: playerHover
                            },
                            description: info.description.chat,
                            favicon: info.favicon ? `data:image/png;base64,${info.favicon.toString('base64')}` : undefined
                        };
                    }
                });

                this.p.server.on('listening', () => {
                    res();
                    this.p.emit('listening');
                });

                this.p.server.on('connection', client => {
                    this.p.clientInformation.set(client, {});

                    let clientState = null;

                    client.on('packet', ({ payload } = {}, { name, state } = {}, _, buffer) => {
                        if (
                            name === 'legacy_server_list_ping' &&
                            state === 'handshaking' &&
                            payload === 1
                        )
                            handleLegacyPing.call(this, buffer, client, this.serverList); //todo: check which versions are included in "legacy" and maybe add support for older serverlist versions?
                    });

                    client.on('state', state => { clientState = state });

                    client.on('set_protocol', ({ protocolVersion, serverHost, serverPort }) => {
                        const isLegacy = serverHost === '';

                        this.p.clientInformation.get(client).clientEarlyInformation = {
                            ip: client.socket.remoteAddress,
                            version: protocolVersion,
                            connection: {
                                host: isLegacy ? null : serverHost,
                                port: isLegacy ? null : serverPort
                            }
                        };
                        this.p.clientInformation.get(client).clientLegacyPing = false;

                        if ((clientState === 'login' && (this.p.clientInformation.get(client).clientEarlyInformation.version !== settings.version) || isLegacy)) { //todo: is it (clientState && version) || isLegacy or clientState && (version || isLegacy)
                            let endReason = this.wrongVersionConnect({ ...this.p.clientInformation.get(client).clientEarlyInformation, legacy: isLegacy });

                            if (typeof endReason === 'string')
                                if (isLegacy) {
                                    const buffer = Buffer.alloc(2);
                                    buffer.writeUInt16BE(endReason.length);

                                    const responseBuffer = Buffer.concat([Buffer.from('ff', 'hex'), buffer, endianToggle(Buffer.from(endReason, 'utf16le'), 16)])

                                    return client.socket.write(responseBuffer)
                                } else
                                    client.end(endReason)
                            else if (endReason !== null)
                                throw new Error(`wrongVersionConnect endReason must be either a string or null, received ${endReason} (${typeof endReason})`);
                        };

                    });

                });

                this.p.server.on('login', client => {
                    new Client(client, this, this.p.clientInformation.get(client).clientEarlyInformation, this.defaultClientProperties);
                });
            });
        };

    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected access to private properties from outside of the module. This is not recommended and may cause unexpected behavior.');

        return this[_p];
    }

    set p(value) {
        console.error('(minecraft-server) ERROR: Setting private properties is not supported. Action ignored.');
    }

    listen() {
        // when calling this.p.listen, it will be set to null
        if (!this.p.listen)
            throw new Error('<Server>.listen has already been called');

        return this.p.listen();
    }

    joinProxyClient(proxyClient) {
        if (this.p.listen)
            throw new Error('Server is not yet listening, call <Server>.listen( first');

        new Client(proxyClient.client, this, proxyClient.earlyInformation, this.defaultClientProperties);
    }

    on(event, callback) {
        if (!events.includes(event))
            throw new Error(`Unknown event "${event}"`);

        this.p.events[event].push({ callback, once: false })
    }

    once(event, callback) {
        if (!events.includes(event))
            throw new Error(`Unknown even "${event}"`);

        this.p.events[event].push({ callback, once: true })
    }

    async close() {
        // if the server is not yet listening, we can just return
        if (this.p.listen)
            return;

        await wait(500); //to avoid weird bugs

        for (const client of this.clients) client.p.shutdown();
        this.p.server.close();
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
    respondToLegacyPing.call(this, parseLegacyPing(request), client, serverList);
}

function respondToLegacyPing({ protocol, hostname, port }, client, serverList) {
    this.p.clientInformation.get(client).clientEarlyInformation = {
        ip: client.socket.remoteAddress,
        version: protocol ?? null,
        connection: {
            host: hostname,
            port
        }
    }
    this.p.clientInformation.get(client).clientLegacyPing = true

    let info = serverList({
        ...this.p.clientInformation.get(client).clientEarlyInformation,
        version: //todo: give protocolVersion instead of versionName
            versions.find(a => a.legacy === this.p.clientInformation.get(client).clientLegacyPing && a.protocol === this.p.clientInformation.get(client).clientEarlyInformation.version)?.version ||
            versions.find(a => a.legacy === !this.p.clientInformation.get(client).clientLegacyPing && a.protocol === this.p.clientInformation.get(client).clientEarlyInformation.version)?.version,

        legacy: this.p.clientInformation.get(client).clientLegacyPing //todo: add legacy to clientEarlyInformation?
    });

    if (!info) info = {};
    if (!info.players) info.players = {};
    if (info.players.max === undefined) info.players.max = settings.defaults.serverList.maxPlayers;
    if (info.players.online === undefined) info.players.online = this.clients.length;
    if (info.description === undefined) info.description = settings.defaults.serverList.motd;
    if (!(info.description instanceof Text)) info.description = new Text(info.description);
    if (!info.version) info.version = {};
    if (!info.version.correct) info.version.correct = settings.version;

    const responseString = '\xa7' + [
        1,
        parseInt(versions.find(a => a.legacy === true && a.version === info.version.correct)?.protocol ?? 127),
        `${info.version?.wrongText ?? info.version.correct}`,
        info.description.string.split('\n')[0], // legacy version only supports one line
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
    /* 1 */ request.push(hexToNumber(requestLeft.splice(0, requestLeft.join('').indexOf('fa')).join(''))) //payload //todo: "payload" is unclear, what does this mean? //todo: what does this line do?
    /* 2 */ request.push(requestLeft.splice(0, 2).join('')) //fa

    //todo: add checks to see if sent information is what we expect
    if (requestLeft.length === 0) return { protocol: null, hostname: null, port: null } //The client didn't send any information

    /* 3 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //000b (=11) length of following string
    /* 4 */ request.push(hexToString(requestLeft.splice(0, request[3] * 4).join(''))) // MC|PingHost
    /* 5 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //length of rest of request
    /* 6 */ request.push(hexToNumber(requestLeft.splice(0, 2).join(''))) //protocol version
    /* 7 */ request.push(hexToNumber(requestLeft.splice(0, 4).join(''))) //length of following string
    /* 8 */ request.push(hexToString(requestLeft.splice(0, request[7] * 4).join(''))) //hostname
    /* 9 */ request.push(hexToNumber(requestLeft.splice(0, 8).join(''))) //port
    //todo: add checks to see if sent information is what we expect

    return {
        protocol: request[6],
        hostname: request[8],
        port: request[9]
    }
}

module.exports = Server;