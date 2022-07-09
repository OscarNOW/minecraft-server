const { textModifiers, textColorNameMapping } = require('../../functions/loader/data');
const { CustomError } = require('../utils/CustomError.js');

class Text {
    constructor(text) {
        this._input = text;
        this._string = null;
        this._array = null
    }

    toString() {
        return this.string;
    }

    get array() {
        if (this._input)
            if (typeof this._input == 'string') {
                this._string = Text.parseString(this._input);
                this._input = null;
            } else {
                this._array = Text.parseArray(this._input);
                this._input = null;
            }

        if (this._array === null)
            this._array = Text.stringToArray(this._string);

        return this._array;
    }

    get string() {
        if (this._input)
            if (typeof this._input == 'string') {
                this._string = Text.parseString(this._input);
                this._input = null;
            } else {
                this._array = Text.parseArray(this._input);
                this._input = null;
            }

        if (this._string === null)
            this._string = Text.arrayToString(this._array)

        return this._string;
    }

    set array(val) {
        this._input = val;

        this._array = null;
        this._string = null
    }

    set string(val) {
        this._input = val;

        this._string = null;
        this._array = null;
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
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })
                    text += val.text
                } else {
                    currentModifiers = val.modifiers;
                    text += '§r'
                    if (val.color != 'default')
                        text += `§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`

                    val.modifiers.forEach(v => {
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })

                    text += val.text
                }
            else if (val.color == 'default') {
                currentColor = 'default'
                currentModifiers = val.modifiers
                text += '§r'

                val.modifiers.forEach(v => {
                    text += `§${textModifiers.find(({ name }) => name == v).char}`
                })
                text += val.text;

            } else {
                currentColor = val.color;
                currentModifiers = val.modifiers;

                if (modCanExtend) {
                    text += `§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`
                    newMod.forEach(v => {
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })
                    text += val.text;
                } else {
                    text += `§r§${Object.keys(textColorNameMapping).find(key => textColorNameMapping[key] == val.color)}`
                    val.modifiers.forEach(v => {
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })
                    text += val.text;
                }

            }
        })

        return text;
    }
    static parseArray(text) {
        if (!Array.isArray(text))
            text = [text]
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
                if (!textColorNameMapping[val] && !textModifiers.find(({ char }) => char == val))
                        /* -- Look at stack trace for location -- */ throw new
                        CustomError('expectationNotMet', 'libraryUser', [
                            ['', 'colorLetter', ''],
                            ['in the function "', 'stringToArray', '"'],
                            ['in the class ', this.constructor.name, ''],
                        ], {
                            got: val,
                            expectationType: 'value',
                            expectation: Object.keys(textColorNameMapping).concat(textModifiers.map(a => a.char)),
                        }, Text.stringToArray).toString()
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
                    } else if (textModifiers.find(({ char }) => char == val).name == 'reset') {
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
                        if (!currentModifiers.includes(textModifiers.find(({ char }) => char == val).name)) {
                            let copy = Object.assign([], currentModifiers);
                            arr.push({
                                text: current,
                                color: currentColor,
                                modifiers: copy
                            })
                            current = '';
                            currentModifiers.push(textModifiers.find(({ char }) => char == val).name)
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

module.exports = Object.freeze({ Text });