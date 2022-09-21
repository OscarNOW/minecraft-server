module.exports = {
    index: 0,
    func() {
        let clientKeepAliveKick = 30000; //todo: move to settings
        let sendKeepAliveInterval = 4000;

        let keepAlivePromises = {};
        this.p.setInterval(() => {
            let currentId = Math.floor(Math.random() * 1000000);
            while (keepAlivePromises[currentId])
                currentId = Math.floor(Math.random() * 1000000);

            new Promise((res, rej) => {
                keepAlivePromises[currentId] = { res, rej, resolved: false };

                this.p.setTimeout(() => {
                    if (this.online && !keepAlivePromises[currentId].resolved)
                        rej(new Error(`Client didn't respond to keep alive packet in time`));

                    delete keepAlivePromises[currentId];
                }, clientKeepAliveKick)
            })

            this.p.sendPacket('keep_alive', {
                keepAliveId: BigInt(currentId)
            })
        }, sendKeepAliveInterval)

        this.p.client.on('keep_alive', ({ keepAliveId }) => {
            keepAlivePromises[keepAliveId[1]].resolved = true;
            keepAlivePromises[keepAliveId[1]].res();
        })
    }
}