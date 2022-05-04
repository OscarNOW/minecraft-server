class ChangableRgb {
    constructor(onChange, rgb) {
        this._onChange = onChange;
        this._ = rgb;
    }

    get r() {
        return this._.r;
    }
    get g() {
        return this._.g;
    }
    get b() {
        return this._.b;
    }
    set r(_) {
        this._.r = _;
        this._onChange(this._);
    }
    set g(_) {
        this._.g = _;
        this._onChange(this._);
    }
    set b(_) {
        this._.b = _;
        this._onChange(this._);
    }
}

module.exports = { ChangableRgb };