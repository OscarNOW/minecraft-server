class InformationClient {
    constructor(client, server) {

        this.client = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this.client.profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE)
            this.textures.cape = textures.CAPE.url;

        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.entityId = this.client.id;
        this.ping = this.client.latency;

    }

    kick(reason) {
        this.client.end(`${reason}`);
    }
}

module.exports = { InformationClient }