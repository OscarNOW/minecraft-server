const { Client } = require('../utils/Client');

const protocolVersions = require('../../data/protocolVersions.json')
const version = require('../../data/version.json');

const mc = require('minecraft-protocol');
const { EventEmitter } = require('events');

function getVersionFromProtocol(protocol) {
    return Object.keys(protocolVersions).find(x => protocolVersions[x] == protocol) ?? 'newer'
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

        let serverListVersions = {};

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version,
            beforePing: (response, client) => {

                let info = this.serverList({
                    ip: client.socket.remoteAddress,
                    version: serverListVersions[client.socket.remoteAddress]
                });

                let playerHover = [];
                if (typeof info.players.hover == 'string')
                    playerHover = info.players.hover.split('\n').map(val => {
                        return { name: val, id: '00000000-0000-4000-8000-000000000000' }
                    })
                else
                    for (const value of Object.values(info.players.hover))
                        playerHover.push({ name: value.name, id: value.uuid })

                return {
                    version: {
                        name: info.version.wrongText,
                        protocol: protocolVersions[info.version.correct]
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: playerHover
                    },
                    description: info.description
                }
            }
        })

        let clientVersions = {};

        this.server.on('connection', client => {
            let clientState = null;
            let clientVersion;

            client.on('state', state => {
                if (state == 'login')
                    clientState = 'login'
                else if (state == 'status')
                    clientState = 'status'
            })

            client.on('set_protocol', ({ protocolVersion }) => {
                clientVersion = getVersionFromProtocol(protocolVersion)

                if (clientState == 'login') {

                    clientVersions[client.uuid] = clientVersion;

                    if (clientVersion != version) {
                        let ret = this.wrongVersionConnect({ version: clientVersion, ip: client.socket.remoteAddress });
                        if (typeof ret == 'string')
                            client.end(ret)
                        else if (ret !== null)
                            throw new Error(`Unknown return from wrongVersionConnect "${ret}" (${typeof ret}). It has to be a string or null. `)
                    }

                } else if (clientState == 'status')
                    serverListVersions[client.socket.remoteAddress] = clientVersion;

            })
        })

        this.server.on('login', async client => {
            new Client(client, this, clientVersions[client.uuid]);
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