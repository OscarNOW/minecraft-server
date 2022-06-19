const ps = Object.freeze(Object.fromEntries([
    '_onChange'
].map(a => [a, Symbol(a)])))

class ChangablePosition {
    constructor(onChange, position) {
        this[ps._onChange] = onChange;
        this._ = position;
    }

    get x() {
        return this._.x;
    }
    get y() {
        return this._.y;
    }
    get z() {
        return this._.z;
    }
    get yaw() {
        return this._.yaw;
    }
    get pitch() {
        return this._.pitch;
    }
    set x(_) {
        this._.x = _;
        this[ps._onChange(this._)];
    }
    set y(_) {
        this._.y = _;
        this[ps._onChange](this._);
    }
    set z(_) {
        this._.z = _;
        this[ps._onChange](this._);
    }
    set yaw(_) {
        this._.yaw = _;
        this[ps._onChange](this._);
    }
    set pitch(_) {
        this._.pitch = _;
        this[ps._onChange](this._);
    }
}

module.exports = Object.freeze({ ChangablePosition });