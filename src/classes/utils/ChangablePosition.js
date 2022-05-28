class ChangablePosition {
    constructor(onChange, position) {
        this._onChange = onChange;
        this._ = position;

        this.type = 'position';
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
        this._onChange(this._);
    }
    set y(_) {
        this._.y = _;
        this._onChange(this._);
    }
    set z(_) {
        this._.z = _;
        this._onChange(this._);
    }
    set yaw(_) {
        this._.yaw = _;
        this._onChange(this._);
    }
    set pitch(_) {
        this._.pitch = _;
        this._onChange(this._);
    }
}

module.exports = Object.freeze({ ChangablePosition });