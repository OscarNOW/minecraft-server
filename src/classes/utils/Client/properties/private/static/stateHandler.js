const CustomError = require('../../../../CustomError.js');

const states = Object.freeze([ // also change state type in Client.d.ts if this is changed
    'connecting',
    'connected',
    'loginSent',
    'settingsReceived',
    'afterLoginPacketsSent',
    'clientSpawned',
    'brandReceived',
    'offline'
]);

module.exports = {
    state: () => states[0],
    stateHandler: () => ({

        checkReady() {
            const loginSentIndex = states.indexOf('loginSent');
            const currentIndex = states.indexOf(this.p.state);
            const offlineIndex = states.indexOf('offline');

            return loginSentIndex < currentIndex && currentIndex < offlineIndex;
        },

        init() {
            this.p.stateHandler.updateState.set.call(this, 'connected');
        },

        handleNewState(currentState) {
            let nextState = states[states.indexOf(currentState) + 1];

            if (currentState === 'settingsReceived') {

                this.server.clients.push(this);
                this.p.emit('connect');
                this.server.p.emit('connect', this);

            } else if (currentState === 'clientSpawned') {

                this.p.emit('join');
                this.server.p.emit('join', this);

            } else if (currentState === 'brandReceived') {

                this.p.emit('brandReceive');

            } else if (currentState === 'offline') {

                this.server.clients.splice(this.server.clients.indexOf(this), 1);
                this.p.emit('leave');
                this.server.p.emit('leave', this);

            }

            if (currentState !== this.p.state)
                return; // state has changed

            if (nextState === 'loginSent') {

                this.p.sendLoginPacket();
                this.p.stateHandler.updateState.set.call(this, 'loginSent');

            } else if (nextState === 'afterLoginPacketsSent') {

                this.p.sendAfterLoginPackets();
                this.p.stateHandler.updateState.set.call(this, 'afterLoginPacketsSent');

            } else if (nextState === 'clientSpawned') {

                this.position = {};

                this.p.stateHandler.updateState.set.call(this, 'clientSpawned');

            }

        },

        updateState: {

            set(stateName) {
                const oldIndex = states.indexOf(this.p.state);

                if (!states.includes(stateName))
                    throw new Error(`Unknown new state name "${stateName}"`);

                const newIndex = states.indexOf(stateName);

                if (newIndex <= oldIndex)
                    throw new Error(`New state must be later than previous state, newIndex ${newIndex}, oldIndex ${oldIndex}`);

                this.p.state = stateName;
                this.p.stateHandler.handleNewState.call(this, stateName);

            },

            close() {
                this.p.stateHandler.updateState.set.call(this, 'offline');
            },

            packetReceived(packet) {
                if (packet === 'settings')
                    this.p.stateHandler.updateState.set.call(this, 'settingsReceived');
                else if (packet === 'brand')
                    this.p.stateHandler.updateState.set.call(this, 'brandReceived');
                else
                    throw new Error(`Don't know what to do with stateHandler packetReceived "${packet}"`);
            }

        }

    })
}