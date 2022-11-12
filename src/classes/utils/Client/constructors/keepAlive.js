const { timing: { keepAliveTimeout, sendKeepAliveInterval } } = require('../../../../settings.json');

const CustomError = require('../../CustomError.js');

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
                        rej(new CustomError('expectationNotMet', 'client', `response in  <remote ${this.constructor.name}>.keep_alive(...)  `, {
                            got: 'no call',
                            expectationType: 'value',
                            expectation: ['call']
                        }, null, { server: this.server, client: this }))

                    delete keepAlivePromises[currentId];
                }, keepAliveTimeout)
            }).catch(e => this.p.emitError(e));

            this.p.sendPacket('keep_alive', {
                keepAliveId: BigInt(currentId)
            })
        }, sendKeepAliveInterval)

        this.p.clientOn('keep_alive', ({ keepAliveId }) => {
            keepAlivePromises[keepAliveId[1]].resolved = true;
            keepAlivePromises[keepAliveId[1]].res();
        })
    }
}