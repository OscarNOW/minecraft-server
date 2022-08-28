const { textModifiers, textColors } = require('../../functions/loader/data');

const crypto = require('crypto')

const CustomError = require('../utils/CustomError.js');

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
        this._uncolored = null;
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

    get uncolored() {
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

        if (this._uncolored === null)
            this._uncolored = Text.stringToUncolored(this._string)

        return this._uncolored;
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

    set uncolored(val) {
        this.__reset();
        this._input = val;
    }

    static stringToUncolored(string) {
        let out = '';
        let isSpecial = false;

        for (const char of string) {
            if (isSpecial) {
                isSpecial = false;
                continue;
            }

            if (char == '§') {
                isSpecial = true;
                continue;
            }

            out += char;
        }

        return out
    }

    static arrayToString(a) {
        let array = this.parseArray(a);

        let text = '§r';
        let currentModifiers = [];
        let currentColor = 'default';

        for (const val of array) {
            if (val.text == '') continue;

            let modCanExtend = true;
            for (const currentModifier of currentModifiers)
                if (!val.modifiers.includes(currentModifier))
                    modCanExtend = false;

            let newMod = [];
            if (modCanExtend)
                for (const modifier of val.modifiers)
                    if (!currentModifiers.includes(modifier))
                        newMod.push(modifier);

            if (val.color == currentColor)
                if (modCanExtend) {
                    currentModifiers = val.modifiers;
                    for (const v of newMod)
                        text += `§${textModifiers.find(({ name }) => name == v).char}`

                    text += val.text
                } else {
                    currentModifiers = val.modifiers;
                    text += '§r'
                    if (val.color != 'default')
                        text += `§${textColors.find(({ name }) => name == val.color).char}`

                    for (const modifier of val.modifiers)
                        text += `§${textModifiers.find(({ name }) => name == modifier).char}`

                    text += val.text
                }
            else if (val.color == 'default') {
                currentColor = 'default'
                currentModifiers = val.modifiers
                text += '§r'

                for (const modifier of val.modifiers)
                    text += `§${textModifiers.find(({ name }) => name == modifier).char}`

                text += val.text;

            } else {
                currentColor = val.color;
                currentModifiers = val.modifiers;

                if (modCanExtend) {
                    text += `§${textColors.find(({ name }) => name == val.color).char}`

                    for (const v of newMod)
                        text += `§${textModifiers.find(({ name }) => name == v).char}`

                    text += val.text;
                } else {
                    text += `§r§${textColors.find(({ name }) => name == val.color).char}`

                    for (const v of val.modifiers)
                        text += `§${textModifiers.find(({ name }) => name == v).char}`

                    text += val.text;
                }

            }
        }

        return text;
    }

    static parseArray(text) {
        if (!Array.isArray(text))
            text = [text]
        let array = [];

        for (const val of text) {
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
                    modifiers: [...new Set(val.modifiers || [])].sort(),
                    insertion: val.insertion ?? undefined
                };

            array.push(obj);
        };

        array = array.filter(val => val.text !== '')

        return array;
    }

    static stringToArray(text) {
        let arr = [];

        let isModifier = false;
        let current = '';
        let currentColor = 'default';
        let currentModifiers = [];

        for (const val of text.split('')) {
            if (isModifier) {
                if (!textColors.find(({ char }) => char == val) && !textModifiers.find(({ char }) => char == val))
                    throw new CustomError('expectationNotMet', 'libraryUser', `colorLetter in  ${this.constructor.name}.stringToArray(<includes colorLetter ${val}>)  `, {
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

                isModifier = false;
                continue;
            }

            if (val == '§')
                isModifier = true;
            else
                current += val;
        }

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

        return this.minifyChat(out);
    }

    static minifyChat(c) {
        let chat = Object.assign({}, this.parseChat(c));

        chat = recursiveMinifyChat(chat, {
            color: 'reset',
            ...Object.fromEntries(textModifiersWithoutReset.map(({ name }) => [name, false]))
        });

        return chat;
    }

    static parseChat(chat) {
        return stripShorthandFromChat(chat);
    }
}

function stripShorthandFromChat(chat) {
    let obj;

    if (['string', 'number', 'boolean'].includes(typeof chat) || chat == null)
        obj = { text: `${chat}` };

    if (Array.isArray(chat))
        obj = { ...chat[0], extra: [...chat[0].extra, ...chat.slice(1)] };

    if (
        typeof chat == 'object' &&
        !Array.isArray(chat) &&
        chat != null
    ) {
        obj = chat;
    }

    for (const extra in obj.extra || [])
        obj.extra[extra] = stripShorthandFromChat(obj.extra[extra]);

    return obj;
};

function recursiveMinifyChat(chat, inherited) {
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
            chat.extra[extraIndex] = recursiveMinifyChat(chat.extra[extraIndex], styles);

        chat = [chat, ...chat.extra];
        delete chat[0].extra;

        if (Object.keys(overwrittenStyles).length == 0)
            chat[0] = chat[0].text;
    } else if (Object.keys(overwrittenStyles).length == 0) {
        if (!isNaN(parseInt(chat.text)))
            chat = parseInt(chat.text)
        else if (chat.text == 'true' || chat.text == 'false')
            chat = Boolean(chat.text)
        else
            chat = chat.text;
    }

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