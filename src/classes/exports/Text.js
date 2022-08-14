const { textModifiers, textColors } = require('../../functions/loader/data');

const crypto = require('crypto')

const CustomError  = require('../utils/CustomError.js');

const textModifiersWithoutReset = textModifiers.filter(({ name }) => name != 'reset');
const textColorsWithDefault = [...textColors, { char: 'r', name: 'default', minecraftName: 'reset' }];

class Text {
    constructor(text = '') {
        this.__reset();
        this._input = text;
    }

    toString() {
        return this.string;
    }

    __reset() {
        this._input = null;
        this._string = null;
        this._array = null;
        this._chat = null;
        this._hash = null;
    }

    get hash() {
        if (this._hash)
            return this._hash;

        this._hash = crypto.createHash('sha256').update(JSON.stringify(this.array)).digest('base64');
        return this._hash;
    }

    get array() {
        let inp = this._input;
        if (inp !== null)
            if (typeof inp == 'string') {
                this.__reset();
                this._array = Text.stringToArray(inp);
            } else {
                this.__reset();
                this._array = Text.parseArray(inp);
            }

        return this._array;
    }

    get string() {
        let inp = this._input;

        if (inp !== null)
            if (typeof inp == 'string') {
                this.__reset();
                this._array = Text.stringToArray(inp);
            } else {
                this.__reset();
                this._array = Text.parseArray(inp);
            }

        if (this._string === null)
            this._string = Text.arrayToString(this._array)

        return this._string;
    }

    get chat() {
        let inp = this._input;
        if (inp !== null)
            if (typeof inp == 'string') {
                this.__reset();
                this._array = Text.stringToArray(inp);
            } else {
                this.__reset();
                this._array = Text.parseArray(inp);
            }

        this._chat = Text.arrayToChat(this._array);

        return this._chat;
    }

    set array(val) {
        this.__reset();
        this._input = val;
    }

    set string(val) {
        this.__reset();
        this._input = val;
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
                        text += `§${textColors.find(({ name }) => name == val.color).char}`

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
                    text += `§${textColors.find(({ name }) => name == val.color).char}`
                    newMod.forEach(v => {
                        text += `§${textModifiers.find(({ name }) => name == v).char}`
                    })
                    text += val.text;
                } else {
                    text += `§r§${textColors.find(({ name }) => name == val.color).char}`
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
                    throw new CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'colorLetter', ''],
                        ['in the function "', 'stringToArray', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: val,
                        expectationType: 'value',
                        expectation: [...textColors.map(({ char }) => char), ...textModifiers.map(({ char }) => char)],
                    }, Text.stringToArray).toString()
                else {
                    if (textColors.find(({ char }) => char == val)) {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        })
                        current = ''
                        currentColor = textColors.find(({ char }) => char == val).name
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
        let array = this.parseArray(a);
        let out;

        for (const v of array) {
            let val = convertArrayObjectToChatObject(v);

            if (val.text == '') return;

            if (!out) {
                out = val
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

            let lowestDiffLevel = levels[levelDifferences.indexOf(Math.min(...levelDifferences))];

            if (isSameChatStyling(lastLevel, val)) {
                lastLevel.text += val.text;
                continue;
            }

            if (!lowestDiffLevel.extra) lowestDiffLevel.extra = [];
            lowestDiffLevel.extra.push(val)
        }

        if (!out)
            out = { text: '' }

        return this.parseChat(out);
    }
    static parseChat(c) {
        let chat = Object.assign({}, c);

        chat = recursiveParseChat(chat, {
            color: 'reset',
            ...Object.fromEntries(textModifiersWithoutReset.map(({ name }) => [name, false]))
        });

        return chat;
    }
}

function recursiveParseChat(chat, inherited) {
    let styles = {};
    for (let { name } of [...textModifiersWithoutReset, { name: 'color' }])
        styles[name] = chat[name] ?? inherited[name];

    let overwrittenStyles = {}
    for (let name in styles)
        if (styles[name] != inherited[name])
            overwrittenStyles[name] = styles[name]

    for (let name in styles)
        if (overwrittenStyles[name] === undefined)
            delete chat[name]
        else
            chat[name] = overwrittenStyles[name]


    if (chat.extra) {
        for (let extraIndex in chat.extra)
            chat.extra[extraIndex] = recursiveParseChat(chat.extra[extraIndex], styles);

        chat = [chat, ...chat.extra];
        delete chat[0].extra;

        if (Object.keys(overwrittenStyles).length == 0)
            chat[0] = chat[0].text;
    } else if (Object.keys(overwrittenStyles).length == 0)
        chat = chat.text;

    return chat
}

function convertArrayObjectToChatObject({ text, color, modifiers }) {
    return {
        text,
        color: textColorsWithDefault.find(({ name }) => name == color).minecraftName,
        ...convertModifierArrayToObject(modifiers)
    }
}

function convertModifierArrayToObject(modifiers) {
    return Object.fromEntries(
        textModifiersWithoutReset
            .map(({ name }) => name)
            .map(a => [a, modifiers.includes(a)])
    );
}

function isSameChatStyling(a, b) {
    if (a.color != b.color)
        return false;

    for (let { name } of textModifiersWithoutReset)
        if (a[name] != b[name])
            return false;

    return true;
}

function chatLevelDifferenceAmount(a, b) {
    let difference = 0;

    if (a.color != b.color) difference++;

    for (let { name } of textModifiersWithoutReset)
        if (a[name] != b[name])
            difference++;

    return difference;
}

module.exports = Text;