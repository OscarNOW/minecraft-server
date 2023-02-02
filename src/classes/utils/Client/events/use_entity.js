const Client = require('../../Client.js');
const Entity = require('../../Entity.js');
const CustomError = require('../../CustomError.js');

const { sneaking: clientSneaking } = require('../properties/public/dynamic/sneaking.js');

module.exports = {
    use_entity({ target, mouse, hand, x, y, z, sneaking }) {
        if (!this.entities[target])
            return this.p.emitError(new CustomError('expectationNotMet', 'client', `target in  <remote ${this.constructor.name}>.use_entity({ target: ${require('util').inspect(target)} })  `, {
                got: target,
                expectationType: 'value',
                expectation: Object.keys(this.entities)
            }, null, { server: this.server, client: this }));

        clientSneaking.set.call(this, sneaking);

        const targetObj = this.entities[target];

        let emitter;

        if (
            targetObj instanceof Client ||
            targetObj instanceof Entity ||
            targetObj.prototype instanceof Entity // inherits from Entity, typeof EntityLike
        )
            emitter = targetObj.p;
        else
            throw new Error(`unknown type in <Client>.entities[${target}]`); //todo: use CustomError with library as fault

        if (mouse === 2) {
            if (hand !== 0 && hand !== 1)
                this.p.emitError(new CustomError('expectationNotMet', 'client', `hand in  <remote ${this.constructor.name}>.use_entity({ hand: ${require('util').inspect(hand)} })  `, {
                    got: hand,
                    expectationType: 'value',
                    expectation: [0, 1]
                }, null, { server: this.server, client: this }));

            emitter.emit.call(targetObj, 'rightClick', {
                position: {
                    x: x,
                    y: y,
                    z: z
                },
                isMainHand: hand === 0
            })
        } else if (mouse === 0)
            return //Duplicate of rightClick
        else if (mouse === 1)
            emitter.emit.call(targetObj, 'leftClick');
        else
            this.p.emitError(new CustomError('expectationNotMet', 'client', `mouse in  <remote ${this.constructor.name}>.use_entity({ mouse: ${require('util').inspect(mouse)} })  `, {
                got: mouse,
                expectationType: 'value',
                expectation: [0, 1, 2]
            }, null, { server: this.server, client: this }));
    }
}