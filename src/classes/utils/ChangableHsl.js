class ChangableHsl {
    constructor(onChange, hsl) {
        this._onChange = onChange;
        this._ = hsl;
    }

    get h() {
        return this._.h;
    }
    get s() {
        return this._.s;
    }
    get l() {
        return this._.l;
    }

    set h(_) {
        this._.h = _;
        this._onChange(this._);
    }
    set s(_) {
        this._.s = _;
        this._onChange(this._);
    }
    set l(_) {
        this._.l = _;
        this._onChange(this._);
    }
}

module.exports = Object.freeze({ ChangableHsl });