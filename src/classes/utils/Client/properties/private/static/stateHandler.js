const CustomError = require('../../../../CustomError.js');

const states = Object.freeze([
    'connecting',
    'connected',
    'settingsReceived',
    'clientSpawned',
    'offline'
])

module.exports = {
    state: () => states[0],
    stateHandler: () => ({

        init: function () {
            this.p.stateHandler.updateState.set.call(this, 'connected');
        },

        handleNewState: function (stateName) {
            if (stateName == 'settingsReceived') {
                this.server.emit('connect', this);
                this.p.stateHandler.updateState.set.call(this, 'clientSpawned');
            } else if (stateName == 'clientSpawned') {
                this.position = {};
                this.server.emit('join', this);
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