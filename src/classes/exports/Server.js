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

        this.server = mc.createServer({
            encryption: true,
            host: 'localhost',
            version,
            beforePing: (response, client) => { //add option to change motd when wrong version

                let info = this.serverList(client.socket.remoteAddress);

                return {
                    version: {
                        name: info.wrongVersionMessage,
                        protocol: protocolVersions[version]
                    },
                    players: {
                        online: info.players.online,
                        max: info.players.max,
                        sample: info.players.hover.split('\n').map(val => {
                            return { name: val, id: '00000000-0000-4000-0000-100000000000' }
                        })
                    },
                    description: info.description
                }
            }
        })

        const clientVersions = {};

        this.server.on('connection', client => {
            let stop = false;
            let clientVersion;

            client.on('state', state => {
                if (state != 'login')
                    stop = true;
            })

            client.on('set_protocol', ({ protocolVersion }) => {
                if (stop) return;

                clientVersion = getVersionFromProtocol(protocolVersion)
                clientVersions[client.uuid] = clientVersion;

                if (clientVersion != version) {
                    let ret = this.wrongVersionConnect(clientVersion);
                    if (typeof ret == 'string')
                        client.end(ret)
                    else if (ret !== null)
                        throw new Error(`Unknown return from wrongVersionConnect "${ret}" (${typeof ret}). It has to be a string or null. `)
                }
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