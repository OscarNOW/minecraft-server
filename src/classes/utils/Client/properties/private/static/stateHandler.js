const CustomError = require('../../../../CustomError.js');

const states = Object.freeze([
    'connecting',
    'connected',
    'loginSent',
    'settingsReceived',
    'clientSpawned',
    'offline'
])

module.exports = {
    state: () => states[0],
    stateHandler: () => ({

        checkReady: function () {
            const loginSentIndex = states.indexOf('loginSent');
            const currentIndex = states.indexOf(this.p.state);
            const offlineIndex = states.indexOf('offline');

            if (currentIndex < loginSentIndex)
                return false;
            else if (currentIndex >= offlineIndex)
                return false;

            return true;
        },

        init: function () {
            this.p.stateHandler.updateState.set.call(this, 'connected');
        },

        handleNewState: function (currentState) {
            let nextState = states[states.indexOf(currentState) + 1];

            if (currentState === 'clientSpawned') {
                this.p.emit('join');
                this.server.p.emit('join', this);
            } else if (currentState === 'offline') {
                this.server.clients.splice(this.server.clients.indexOf(this), 1);
                this.p.emit('leave');
                this.server.p.emit('leave', this);
            }

            if (nextState === 'loginSent') {

                this.p.sendLoginPacket();
                this.p.stateHandler.updateState.set.call(this, 'loginSent');

            } else if (nextState === 'clientSpawned') {

                this.server.clients.push(this);
                this.p.emit('connect');
                this.server.p.emit('connect', this);

                this.position = {};

                this.p.stateHandler.updateState.set.call(this, 'clientSpawned');

            }

        },

        updateState: {

            set: function (stateName) {
                const oldIndex = states.indexOf(this.p.state);

                if (!states.includes(stateName))
                    this.p.emitError(new CustomError('expectationNotMet', 'library', `stateName in  <${this.constructor.name}>.p.stateHandler.updateState.set(${require('util').inspect(stateName)})  `, {
                        got: stateName,
                        expectationType: 'value',
                        expectation: states.slice(oldIndex)
                    }, this.p.stateHandler.updateState.set, { server: this.server, client: this }));

                const newIndex = states.indexOf(stateName);

                if (newIndex <= oldIndex)
                    this.p.emitError(new CustomError('expectationNotMet', 'library', `stateName in  <${this.constructor.name}>.p.stateHandler.updateState.set(${require('util').inspect(stateName)})  `, {
                        got: stateName,
                        expectationType: 'value',
                        expectation: states.slice(oldIndex)
                    }, this.p.stateHandler.updateState.set, { server: this.server, client: this }));

                this.p.state = stateName;
                this.p.stateHandler.handleNewState.call(this, stateName);

            },

            close: function () {
                this.p.stateHandler.updateState.set.call(this, 'offline');
            },

            packetReceived: function (packet) {
                if (packet === 'settings')
                    this.p.stateHandler.updateState.set.call(this, 'settingsReceived');
                else
                    this.p.emitError(new CustomError('expectationNotMet', 'library', `packet in  <${this.constructor.name}>.p.stateHandler.updateState.packetReceived(${require('util').inspect(packet)})  `, {
                        got: packet,
                        expectationType: 'value',
                        expectation: ['settings']
                    }, this.p.stateHandler.updateState.packetReceived, { server: this.server, client: this }));
            }

        }

    })
}