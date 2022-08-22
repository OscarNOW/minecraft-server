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
                throw new Error("Can't perform this action on this Client yet")
            else if (currentIndex >= offlineIndex)
                throw new Error("Can't perform this action on this Client, because the Client is offline")
        },

        init: function () {
            this.p.stateHandler.updateState.set.call(this, 'connected');
        },

        handleNewState: function (currentState) {
            let nextState = states[states.indexOf(currentState) + 1];

            if (currentState == 'clientSpawned') {
                this.p.emit('join');
                for (const listener of this.server.globals.serverEvents.get(this.server).join) listener(this);
            } else if (currentState == 'offline') {
                this.p.emit('leave');
                for (const listener of this.server.globals.serverEvents.get(this.server).leave) listener(this);
            }

            if (nextState == 'loginSent') {

                this.p.sendLogin();
                this.p.stateHandler.updateState.set.call(this, 'loginSent');

            } else if (nextState == 'clientSpawned') {

                this.p.emit('connect');
                for (const listener of this.server.globals.serverEvents.get(this.server).connect) listener(this);
                this.position = {};

                this.p.stateHandler.updateState.set.call(this, 'clientSpawned');

            }

        },

        updateState: {

            set: function (stateName) {
                const oldIndex = states.indexOf(this.p.state);

                if (!states.includes(stateName))
                    throw new CustomError('expectationNotMet', 'library', `stateName in  <${this.constructor.name}>.p.stateHandler.updateState.set(${require('util').inspect(stateName)})  `, {
                        got: stateName,
                        expectationType: 'value',
                        expectation: states.slice(oldIndex)
                    }, this.p.stateHandler.updateState.set).toString()

                const newIndex = states.indexOf(stateName);

                if (newIndex <= oldIndex)
                    throw new CustomError('expectationNotMet', 'library', `stateName in  <${this.constructor.name}>.p.stateHandler.updateState.set(${require('util').inspect(stateName)})  `, {
                        got: stateName,
                        expectationType: 'value',
                        expectation: states.slice(oldIndex)
                    }, this.p.stateHandler.updateState.set).toString()

                this.p.state = stateName;
                this.p.stateHandler.handleNewState.call(this, stateName);

            },

            close: function () {
                this.p.stateHandler.updateState.set.call(this, 'offline');
            },

            packetReceived: function (packet) {
                if (packet == 'settings')
                    this.p.stateHandler.updateState.set.call(this, 'settingsReceived');
                else
                    throw new CustomError('expectationNotMet', 'library', `packet in  <${this.constructor.name}>.p.stateHandler.updateState.packetReceived(${require('util').inspect(packet)})  `, {
                        got: packet,
                        expectationType: 'value',
                        expectation: ['settings']
                    }, this.p.stateHandler.updateState.packetReceived).toString()
            }

        }

    })
}