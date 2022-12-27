module.exports = {
    chunks: {
        get: function () {

            if (!this.p._chunks) {
                this.p.chunksGenerated = true;
                this.p._chunks = Object.freeze([]);
            };

            if (!this.p.chunksGenerated) {
                this.p.chunksGenerated = true;
                this.p.chunks = Object.freeze(this.p._chunks
                    .map(generator => generator()) //generator calls (new LoadedChunk(...)) for every LoadedChunk
                );
            }

            return this.p._chunk;
        },
        getPrivate: function () {
            if (!this.p._chunks) {
                this.p.chunksGenerated = true;
                this.p._chunks = Object.freeze([]);
            }

            return this.p._chunks;
        },
        setPrivate: function (value) {
            let oldValue;
            let changed;

            if (this.p.changeEventHasListeners('chunks')) {
                oldValue = [...this.chunks];

                changed =
                    value.length !== this.p._chunks?.length ||
                    value.some((a, i) => a !== this.p._chunks?.[i]);
            }

            this.p._chunks = value;

            if (this.p.changeEventHasListeners('chunks') && changed)
                this.p.emitChange('chunks', oldValue); //will generate chunks if not already generated
        }
    }
}