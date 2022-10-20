class ProxyClient {
    constructor({ latency = 0 } = {}) {
        this.events = [];
        this.hooks = [];

        this._latency = latency;

        this.client = {
            on: (name, callback) => {
                this.hooks.push({
                    callback: (nam, packet) => {
                        if (name == 'packet' || name === nam)
                            callback(packet, { name: nam });
                    }
                })
            },
            write: (name, packet) => {
                for (const { callback } of this.events)
                    callback(name, packet);
            },
            end: reason => {
                this.client.write('kick_disconnect', reason)
            },
            id: Math.floor(Math.random() * 10000),
            socket: {
                readyState: 'open' //todo: change to closed when client leaves
            },
            latency: 0, //todo: make this customizable
            username: '', //todo: make this customizable
            uuid: '', //todo: make this customizable
            profile: {
                properties: [{
                    value: toBase64(JSON.stringify({
                        textures: {
                            SKIN: {
                                url: 'https://example.com/' //todo: make this customizable
                            },
                            CAPE: {
                                url: 'https://example.com/' //todo: make this customizable
                            }
                        }
                    }))
                }]
            }
        }

        this.earlyInformation = {
            ip: '', //todo: make this customizable
            version: '1.16.3',
            connection: {
                host: 'localhost', //todo: make this customizable
                port: 25565 //todo: make this customizable
            }
        }
    }

    get latency() {
        return this._latency;
    }

    set latency(value) {
        this._latency = value;
        this.client.latency = value;
    }

    sendPacket(name, packet) {
        console.log(1, this.hooks)
        for (const { callback } of this.hooks)
            callback(name, packet);
    }

    onPacket(callback) {
        this.events.push({ callback });
    }
}

function toBase64(inp) {
    return Buffer.from(inp).toString('base64');
}

module.exports = ProxyClient;