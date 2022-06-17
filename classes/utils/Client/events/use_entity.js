module.exports = {
    use_entity: function (obj) {
        if (!this.entities[obj.target]) throw new Error(`Unknown target "${obj.target}" (${typeof obj.target})`)

        if (obj.mouse == 2) {
            if (obj.hand != 0 && obj.hand != 1) throw new Error(`Unknown hand "${obj.hand}" (${typeof obj.hand})`)
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
            throw new Error(`Unknown mouse "${obj.mouse}" (${typeof obj.mouse})`)
    }
}