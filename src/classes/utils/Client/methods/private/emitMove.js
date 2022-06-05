module.exports = {
    emitMove: function (info) {
        let changed = false;
        [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ].forEach(val => {
            if (info[val] !== undefined && this.p._position[val] != info[val]) {
                changed = true;
                this.p._position._[val] = info[val];
            }
        });

        if (changed)
            this.p.emitObservable('position');
    }
}