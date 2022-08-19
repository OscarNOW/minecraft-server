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

            if (nextState == 'loginSent') {

                this.p.sendLogin();
                this.p.stateHandler.updateState.set.call(this, 'loginSent');

            } else if (nextState == 'clientSpawned') {

                this.server.emit('connect', this);
                this.position = {};
                this.server.emit('join', this);

                this.p.stateHandler.updateState.set.call(this, 'clientSpawned');

            }
        },

        updateState: {

            set: function (stateName) {
                if (!states.includes(stateName))
                    throw new CustomError('expectationNotMet', 'library', [
                        ['', 'stateName', ''],
                        ['in the function "', 'set', '"'],
                        ['in the object "', 'updateState', '"'],
                        ['in the handler "', 'stateHandler', '"'],
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: stateName,
                        expectationType: 'value',
                        expectation: states
                    }, this.p.stateHandler.updateState.set).toString()

                const newIndex = states.indexOf(stateName);
                const oldIndex = states.indexOf(this.p.state);

                if (newIndex <= oldIndex)
                    throw new CustomError('expectationNotMet', 'library', [
                        ['', 'stateName', ''],
                        ['in the function "', 'set', '"'],
                        ['in the object "', 'updateState', '"'],
                        ['in the handler "', 'stateHandler', '"'],
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: newIndex,
                        expectationType: 'type',
                        expectation: `number > ${oldIndex}`
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
                    throw new CustomError('expectationNotMet', 'library', [
                        ['', 'packet', ''],
                        ['in the function "', 'packetReceived', '"'],
                        ['in the object "', 'updateState', '"'],
                        ['in the handler "', 'stateHandler', '"'],
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: packet,
                        expectationType: 'value',
                        expectation: ['settings']
                    }, this.p.stateHandler.updateState.packetReceived).toString()
            }

        }

    })
}