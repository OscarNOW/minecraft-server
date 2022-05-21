const version = '1.16.3';
const mc = require('minecraft-protocol');
const mcData = require('minecraft-data')(version);
const protocolVersions = require('../../data/protocolVersions.json')

const { Client } = require('../utils/Client');

function getVersionFromProtocol(protocol) {
    return Object.keys(protocolVersions).find(x => protocolVersions[x] == protocol) ?? 'newer'
}

class Server {
    constructor({ serverList, wrongVersionConnect }) {

        this.serverList = serverList;
        this.wrongVersionConnect = wrongVersionConnect;
        this.clients = [];

        this.events = {
            join: [],
            leave: []
        }

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

            client.write('login', {
                entityId: client.id,
                isHardcore: false,
                gameMode: 0,
                previousGameMode: 255,
                worldNames: mcData.loginPacket.worldNames,
                dimensionCodec: mcData.loginPacket.dimensionCodec,
                dimension: mcData.loginPacket.dimension,
                worldName: 'minecraft:overworld',
                hashedSeed: [0, 0],
                maxPlayers: 0,
                viewDistance: 1000,
                reducedDebugInfo: false,
                enableRespawnScreen: true,
                isDebug: false,
                isFlat: false
            });

            new Client(client, this, clientVersions[client.uuid]);
        });

    }

    on(event, callback) {
        if (!this.events[event]) throw new Error(`Unknown event "${event}"`)
        this.events[event].push(callback);
    }

    get playerCount() {
        return this.clients.length;
    }

    close() {
        this.server.close();
    }
}

module.exports = { Server };