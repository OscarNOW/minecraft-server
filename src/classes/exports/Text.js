const { textModifierNameMapping, textColorNameMapping } = require('../../functions/loader/data');

class Text {
    constructor(text) {
        if (typeof text == 'string')
            this._array = Text.stringToArray(text);
        else
            this._array = Text.parseArray(text);
        this._string = Text.arrayToString(this.array);
    }

    toString() {
        return this.string;
    }

    get array() {
        return this._array;
    }

    get string() {
        return this._string;
    }

    set array(val) {
        this._array = Text.parseArray(val);
        this._string = Text.arrayToString(this.array);
    }

    set string(val) {
        this._string = Text.parseString(val);
        this._array = Text.stringToArray(this.string);
    }

    static arrayToString(a) {
        let array = this.parseArray(a);

        let text = '§r';
        let currentModifiers = [];
        let currentColor = 'default';

        array.forEach(val => {
            if (val.text == '') return;

            let modCanExtend = true;
            currentModifiers.forEach(v => {
                if (!val.modifiers.includes(v)) modCanExtend = false;
            })
            let newMod = [];
            if (modCanExtend)
                val.modifiers.forEach(v => {
                    if (!currentModifiers.includes(v)) newMod.push(v);
                })

            if (val.color == currentColor)
                if (modCanExtend) {
                    currentModifiers = val.modifiers;
                    newMod.forEach(v => {
                        text += `§${Object.keys(textModifierNameMapping).find(key => textModifierNameMapping[key] == v)}`
                    })
                    text += val.text
                } else {
                    currentModifiers = val.modifiers;
                    text += '§r'
                    if (val.color != 'default')
                        text += `§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`

                    val.modifiers.forEach(v => {
                        text += `§${Object.keys(textModifierNameMapping).find(key => textModifierNameMapping[key] == v)}`
                    })

                    text += val.text
                }
            else if (val.color == 'default') {
                currentColor = 'default'
                currentModifiers = val.modifiers
                text += '§r'

                val.modifiers.forEach(v => {
                    text += `§${Object.keys(textModifierNameMapping).find(key => textModifierNameMapping[key] == v)}`
                })
                text += val.text;

            } else {
                currentColor = val.color;
                currentModifiers = val.modifiers;

                if (modCanExtend) {
                    text += `§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`
                    newMod.forEach(v => {
                        text += `§${Object.keys(textModifierNameMapping).find(key => textModifierNameMapping[key] == v)}`
                    })
                    text += val.text;
                } else {
                    text += `§r§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`
                    val.modifiers.forEach(v => {
                        text += `§${Object.keys(textModifierNameMapping).find(key => textModifierNameMapping[key] == v)}`
                    })
                    text += val.text;
                }

            }
        })

        return text
    }
    static parseArray(text) {
        let array = [];

        text.forEach(val => {
            let obj;

            if (typeof val == 'string')
                obj = {
                    text: val,
                    color: 'default',
                    modifiers: []
                }
            else
                obj = {
                    text: val.text || '',
                    color: val.color || 'default',
                    modifiers: val.modifiers || []
                };

            array.push(obj);
        });

        array = array.filter(val => val.text !== '')

        return array;
    }
    static stringToArray(text) {
        let arr = [];

        let isModifier = false;
        let current = '';
        let currentColor = 'default';
        let currentModifiers = [];

        text.split('').forEach(val => {
            if (isModifier) {
                if (!textColorNameMapping[val] && !textModifierNameMapping[val])
                    throw new Error(`Unknown color letter "${val}"`)
                else
                    if (textColorNameMapping[val]) {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        })
                        current = ''
                        currentColor = textColorNameMapping[val]
                    } else if (textModifierNameMapping[val] == 'reset') {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        })
                        current = '';
                        currentColor = 'default';
                        currentModifiers = [];
                    } else {
                        if (!currentModifiers.includes(textModifierNameMapping[val])) {
                            let copy = Object.assign([], currentModifiers);
                            arr.push({
                                text: current,
                                color: currentColor,
                                modifiers: copy
                            })
                            current = '';
                            currentModifiers.push(textModifierNameMapping[val])
                        }
                    }
                return isModifier = false;
            }

            if (val == '§')
                isModifier = true;
            else
                current += val;
        })

        arr.push({
            text: current,
            color: currentColor,
            modifiers: currentModifiers
        })

        return this.parseArray(arr);
    }
    static parseString(text) {
        return this.arrayToString(this.stringToArray(text));
    }
}

module.exports = { Text };