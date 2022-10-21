class ProxyClient {
    constructor({ latency = 0, username = '', uuid = '', ip = '', host = 'localhost', port = 25565, skinTextureUrl = 'https://example.com', capeTextureUrl = 'https://example.com' } = {}) {
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
                readyState: 'open'
            },
            latency,
            username,
            uuid,
            profile: {
                properties: [{
                    value: toBase64(JSON.stringify({
                        textures: {
                            SKIN: {
                                url: skinTextureUrl
                            },
                            CAPE: {
                                url: capeTextureUrl
                            }
                        }
                    }))
                }]
            }
        }

        this.earlyInformation = {
            ip,
            version: '1.16.3',
            connection: {
                host,
                port
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
        for (const { callback } of this.hooks)
            callback(name, packet);
    }

    onPacket(callback) {
        this.events.push({ callback });
    }

    removeAllListeners() {
        this.events = [];
    }

    end() {
        this.client.socket.readyState = 'closed';
        this.sendPacket('end');
    }
}

function toBase64(inp) {
    return Buffer.from(inp).toString('base64');
}

module.exports = ProxyClient;