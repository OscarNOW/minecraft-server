const { timing: { keepAliveTimeout, sendKeepAliveInterval } } = require('../../../../settings.json');

module.exports = {
    index: 0,
    func() {
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
                }, keepAliveTimeout)
            })

            this.p.sendPacket('keep_alive', {
                keepAliveId: BigInt(currentId)
            })
        }, sendKeepAliveInterval)

        this.p.mpOn('keep_alive', ({ keepAliveId }) => {
            keepAlivePromises[keepAliveId[1]].resolved = true;
            keepAlivePromises[keepAliveId[1]].res();
        })
    }
}