const CustomError = require('../../CustomError.js');

module.exports = {
    use_entity: function ({ target, mouse, hand, x, y, z, sneaking }) {
        if (!this.entities[target])
            throw new CustomError('expectationNotMet', 'client', [
                ['', 'target', ''],
                ['in the event ', 'use_entity', ''],
                ['in the class ', this.constructor.name, '']
            ], {
                got: target,
                expectationType: 'value',
                expectation: Object.keys(this.entities)
            }).toString()

        this.sneaking = sneaking;

        if (mouse == 2) {
            if (hand != 0 && hand != 1)
                throw new CustomError('expectationNotMet', 'client', [
                    ['', 'target', ''],
                    ['in the event ', 'use_entity', ''],
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: target,
                    expectationType: 'value',
                    expectation: Object.keys(this.entities)
                }).toString()

            this.entities[target].emit('rightClick', {
                position: {
                    x: x,
                    y: y,
                    z: z
                },
                isMainHand: hand == 0
            })
        } else if (mouse == 0)
            return //Duplicate of rightClick
        else if (mouse == 1)
            this.entities[target].emit('leftClick');
        else
            throw new CustomError('expectationNotMet', 'client', [
                ['', 'mouse', ''],
                ['in the event ', 'use_entity', ''],
                ['in the class ', this.constructor.name, '']
            ], {
                got: mouse,
                expectationType: 'value',
                expectation: [0, 1, 2]
            }).toString()
    }
}