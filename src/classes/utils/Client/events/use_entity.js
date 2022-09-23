const Client = require('../../Client.js');
const Entity = require('../../Entity.js');
const CustomError = require('../../CustomError.js');

module.exports = {
    use_entity: function ({ target, mouse, hand, x, y, z, sneaking }) {
        if (!this.entities[target])
            this.p.emitError(new CustomError('expectationNotMet', 'client', `target in  <remote ${this.constructor.name}>.use_entity({ target: ${require('util').inspect(target)} })  `, {
                got: target,
                expectationType: 'value',
                expectation: Object.keys(this.entities)
            }))

        require('../properties/public/dynamic/sneaking.js').sneaking.setPrivate.call(this, sneaking);
        let emitter = this.entities[target] instanceof Client ? this.entities[target].p :
            this.entities[target] instanceof Entity ? this.entities[target].privateEmitter :
                this.entities[target];

        if (mouse == 2) {
            if (hand != 0 && hand != 1)
                this.p.emitError(new CustomError('expectationNotMet', 'client', `hand in  <remote ${this.constructor.name}>.use_entity({ hand: ${require('util').inspect(hand)} })  `, {
                    got: hand,
                    expectationType: 'value',
                    expectation: [0, 1]
                }))

            emitter.emit('rightClick', {
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
            emitter.emit('leftClick');
        else
            this.p.emitError(new CustomError('expectationNotMet', 'client', `mouse in  <remote ${this.constructor.name}>.use_entity({ mouse: ${require('util').inspect(mouse)} })  `, {
                got: mouse,
                expectationType: 'value',
                expectation: [0, 1, 2]
            }))
    }
}