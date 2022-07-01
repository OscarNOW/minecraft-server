module.exports = {
    use_entity: function (obj) {
        if (!this.entities[obj.target])
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'target', ''],
                    ['in the event ', 'use_entity', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: obj.target,
                    expectationType: 'value',
                    expectation: Object.keys(this.entities)
                }).toString()

        if (obj.mouse == 2) {
            if (obj.hand != 0 && obj.hand != 1)
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'client', [
                        ['', 'target', ''],
                        ['in the event ', 'use_entity', '']
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: obj.target,
                        expectationType: 'value',
                        expectation: Object.keys(this.entities)
                    }).toString()

            this.entities[obj.target].emit('rightClick', {
                x: obj.x,
                y: obj.y,
                z: obj.z
            }, obj.hand == 0)
        } else if (obj.mouse == 0)
            return
        else if (obj.mouse == 1)
            this.entities[obj.target].emit('leftClick');
        else
            if (obj.hand != 0 && obj.hand != 1)
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'client', [
                        ['', 'mouse', ''],
                        ['in the event ', 'use_entity', '']
                        ['in the class ', this.constructor.name, '']
                    ], {
                        got: obj.mouse,
                        expectationType: 'value',
                        expectation: [0, 1, 2]
                    }).toString()
    }
}