const { textModifiers, textColors } = require('../../functions/loader/data');

const { CustomError } = require('../utils/CustomError.js');

const textModifiersWithoutReset = textModifiers.filter(({ name }) => name != 'reset');

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
                this._array = Text.stringToArray(this._input);
                this._input = null;
            } else {
                this._array = Text.parseArray(this._input);
                this._input = null;
            }

        return this._array;
    }

    get string() {
        if (this._input)
            if (typeof this._input == 'string') {
                this._array = Text.stringToArray(this._input);
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
                        text += `§${textColors.find(({ name }) => name == val.color)}`

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
                    text += `§${textColors.find(({ name }) => name == val.color)}`
                    newMod.forEach(v => {
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })
                    text += val.text;
                } else {
                    text += `§r§${textColors.find(({ name }) => name == val.color)}`
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
                    modifiers: [...new Set(val.modifiers)].sort() || []
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
                if (!textColors.find(({ char }) => char == val) && !textModifiers.find(({ char }) => char == val))
                        /* -- Look at stack trace for location -- */ throw new
                        CustomError('expectationNotMet', 'libraryUser', [
                            ['', 'colorLetter', ''],
                            ['in the function "', 'stringToArray', '"'],
                            ['in the class ', this.constructor.name, ''],
                        ], {
                            got: val,
                            expectationType: 'value',
                            expectation: [...textColors.map(({ char }) => char), ...textModifiers.map(({ char }) => char)],
                        }, Text.stringToArray).toString()
                else
                    if (textColors.find(({ char }) => char == val)) {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        })
                        current = ''
                        currentColor = textColors.find(({ char }) => char == val)
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
    static arrayToChat(a) {
        //todo: change so inherited properties are actually inherited
        //todo: implement parseChat
        let array = this.parseArray(a);
        let out;

        for (const val of array) {
            if (val.text == '') return;

            if (!out) {
                out = {
                    text: val.text,
                    color: textColors.find(({ name }) => name == val.color).minecraftName,
                    modifiers: modifierArrayToObject(val.modifiers)
                }
                continue;
            }

            let levels = [out];
            let levelDifferences = [];

            let lastLevel = out;
            while (true) {
                if (!lastLevel.extra)
                    break;

                lastLevel = lastLevel.extra[lastLevel.extra.length - 1];
                levels.push(lastLevel)
            }

            for (const levelIndex in levels) {
                const level = levels[levelIndex];
                levelDifferences[levelIndex] = chatLevelDifferenceAmount(level, val);
            }

            let lowestDiffLevel = levels[levelDifferences.indexOf(Math.min(...levelDifferences))]; //todo: what happens if 2 levels have the same difference?

            if (isSameChatStyling(lowestDiffLevel, val)) {
                lowestDiffLevel.text += val.text;
                continue;
            }

            if (!lowestDiffLevel.extra) lowestDiffLevel.extra = [];
            lowestDiffLevel.extra.push({
                text: val.text,
                color: textColors.find(({ name }) => name == val.color).minecraftName,
                modifiers: modifierArrayToObject(val.modifiers)
            })
        }

        return out;
    }
}

function modifierArrayToObject(modifiers) {
    return Object.fromEntries(textModifiersWithoutReset.map(({ name }) => name).map(a => [a, modifiers.includes(a)]));
}

function isSameChatStyling(a, b) {
    if (a.color != b.color)
        return false;

    for (style in Object.keys(textModifiersWithoutReset))
        if (a[style] != b[style])
            return false;

    return true;
}

function chatLevelDifferenceAmount(a, b) {
    let difference = 0;

    if (a.color != b.color) difference++;

    for (style in Object.keys(textModifiersWithoutReset))
        if (a[style] != b[style])
            difference++;

    return difference;
}

module.exports = Object.freeze({ Text });