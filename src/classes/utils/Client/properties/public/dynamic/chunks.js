module.exports = {
    chunks: {
        info: {
            preventSet: true
        },
        get() {

            if (!this.p.chunksGenerated) {
                this.p._chunks = Object.freeze(
                    this.p._chunks.map(generator => generator()) //generator calls (new LoadedChunk(...)) for every LoadedChunk
                );
                this.p.chunksGenerated = true;
            };

            return this.p._chunks;
        },
        getPrivate() {
            return this.p._chunks;
        },
        set(value) {
            let oldValue;
            let changed;

            //todo: what if chunks aren't generated, but there are listeners?
            if (this.p.changeEventHasListeners('chunks')) {
                oldValue = [...this.chunks];

                changed =
                    value.length !== this.p._chunks?.length ||
                    value.some((a, i) => a !== this.p._chunks?.[i]);
            };

            this.p._chunks = value;

            if (this.p.changeEventHasListeners('chunks') && changed)
                this.p.emitChange('chunks', oldValue); //will generate chunks if not already generated
        },
        init() {
            this.p.chunksGenerated = false;
            this.p._chunks = Object.freeze([]);
            //todo: use onFirstChangeEventListener like in <Client>.blocks
        }
    }
}