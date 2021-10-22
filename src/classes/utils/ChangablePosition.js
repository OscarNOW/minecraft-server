class ChangablePosition {
    constructor(onChange, position) {
        this.onChange = onChange;
        this.raw = position;
    }
    get x() {
        return this.raw.x;
    }
    get y() {
        return this.raw.y;
    }
    get z() {
        return this.raw.z;
    }
    get yaw() {
        return this.raw.yaw;
    }
    get pitch() {
        return this.raw.pitch;
    }
    set x(newValue) {
        this.raw.x = newValue;
        this.onChange(this.raw);
    }
    set y(newValue) {
        this.raw.y = newValue;
        this.onChange(this.raw);
    }
    set z(newValue) {
        this.raw.z = newValue;
        this.onChange(this.raw);
    }
    set yaw(newValue) {
        this.raw.yaw = newValue;
        this.onChange(this.raw);
    }
    set pitch(newValue) {
        this.raw.pitch = newValue;
        this.onChange(this.raw);
    }
}

module.exports = { ChangablePosition };