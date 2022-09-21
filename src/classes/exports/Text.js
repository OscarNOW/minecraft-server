const { textModifiers, textColors } = require('../../functions/loader/data');

const fs = require('fs');
const path = require('path');

const CustomError = require('../utils/CustomError.js');

const textModifiersWithoutReset = textModifiers.filter(({ name }) => name != 'reset');
const textColorsWithDefault = [...textColors, { char: 'r', name: 'default', minecraftName: 'reset' }];

const hiddenProperties = [
    '_input',
    '_string',
    '_uncolored',
    '_array',
    '_chat',
    '_hash'
];

let properties = {};

for (const file of fs.readdirSync(path.join(__dirname, './Text/properties/public/dynamic/')).filter(a => a.endsWith('.js')))
    properties[file.split('.js')[0]] = require(`./Text/properties/public/dynamic/${file}`);

class Text {
    constructor(text = '') {
        for (const hiddenProperty of hiddenProperties)
            Object.defineProperty(this, hiddenProperty, {
                configurable: false,
                enumerable: false,
                value: null,
                writable: true
            })

        this._input = text;

        for (const [name, { get, set }] of Object.entries(properties))
            Object.defineProperty(this, name, {
                configurable: false,
                enumerable: true,
                get,
                set
            });
    }

    toString() {
        return this.string;
    }

    __reset() {
        for (const hiddenProperty of hiddenProperties)
            this[hiddenProperty] = null;
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
            else {
                obj = {
                    text: val.text || '',
                    color: val.color || 'default',
                    modifiers: [...new Set(val.modifiers || [])].sort()
                };

                if (val.insertion)
                    obj.insertion = val.insertion

                if (
                    val.clickEvent &&
                    val.clickEvent.action &&
                    ['open_url', 'run_command', 'suggest_command', 'change_page'].includes(val.clickEvent.action) &&
                    val.clickEvent.value &&
                    ['number', 'string'].includes(typeof val.clickEvent.value)
                )
                    obj.clickEvent = {
                        action: val.clickEvent.action,
                        value: val.clickEvent.value
                    }

                if (
                    val.hoverEvent &&
                    val.hoverEvent.action &&
                    ['show_text'].includes(val.hoverEvent.action) &&
                    val.hoverEvent.value &&
                    typeof val.hoverEvent.value == 'object' &&
                    val.hoverEvent.value !== null
                )
                    obj.hoverEvent = {
                        action: val.hoverEvent.action,
                        value: this.parseArray(val.hoverEvent.value)
                    }
            }

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
            let val = convertArrayComponentToChatComponent(v);

            if (val.text == '') continue;

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

    static minifyChat(chat) {
        chat = this.parseChat(chat);
        chat = Object.assign({}, chat);

        chat = minifyChatComponent(chat, {
            color: 'reset',
            insertion: undefined,
            clickEvent: undefined,
            ...Object.fromEntries(textModifiersWithoutReset.map(({ name }) => [name, false]))
        });

        return chat;
    }

    static parseChat(chat) {
        return deMinifyChatComponent(chat);
    }
}

function deMinifyChatComponent(chat) {
    let obj;

    if (['string', 'number', 'boolean'].includes(typeof chat) || chat == null)
        obj = { text: `${chat}` };

    if (Array.isArray(chat))
        obj = { ...chat[0], extra: [...(chat[0].extra || []), ...(chat.slice(1) || [])] };

    if (
        typeof chat == 'object' &&
        !Array.isArray(chat) &&
        chat != null
    ) {
        obj = chat;
    }

    for (const extra in obj.extra || [])
        obj.extra[extra] = deMinifyChatComponent(obj.extra[extra]);

    return obj;
};

function minifyChatComponent(chat, inherited) {
    let properties = {};
    for (const { name } of [...textModifiersWithoutReset, { name: 'color' }, { name: 'insertion' }, { name: 'clickEvent' }])
        properties[name] = chat[name] ?? inherited[name];

    let overwrittenProperties = {}
    for (const name in properties)
        if (!compareChatProperties(properties[name], inherited[name], name))
            overwrittenProperties[name] = properties[name]

    for (const name in properties)
        if (overwrittenProperties[name] === undefined)
            delete chat[name]
        else
            chat[name] = overwrittenProperties[name]

    if (chat.extra) {
        for (const extraIndex in chat.extra)
            chat.extra[extraIndex] = minifyChatComponent(chat.extra[extraIndex], properties);

        chat = [chat, ...chat.extra];
        delete chat[0].extra;

        if (Object.keys(overwrittenProperties).length == 0)
            if (!isNaN(parseInt(chat[0].text)))
                chat[0] = parseInt(chat[0].text)
            else if (chat[0].text == 'true' || chat[0].text == 'false')
                chat[0] = Boolean(chat[0].text)
            else
                chat[0] = chat[0].text;

    } else if (Object.keys(overwrittenProperties).length == 0)
        if (!isNaN(parseInt(chat.text)))
            chat = parseInt(chat.text)
        else if (chat.text == 'true' || chat.text == 'false')
            chat = Boolean(chat.text)
        else
            chat = chat.text;

    return chat
}

function compareChatProperties(a, b, name) {
    if (typeof a != typeof b) return false;

    if (
        typeof a != 'object' &&
        typeof b != 'object'
    )
        return a === b;

    if (name == 'clickEvent')
        return a.action == b.action && a.value == b.value;

    // todo: Use CustomError
    throw new Error(`Don't know how to compare ${name}`);
}

function convertArrayComponentToChatComponent({ text, color, modifiers, insertion, clickEvent }) {
    let out = {
        text,
        color: textColorsWithDefault.find(({ name }) => name == color).minecraftName,
        ...convertModifierArrayToObject(modifiers)
    };

    if (insertion)
        out.insertion = insertion;

    if (clickEvent)
        out.clickEvent = clickEvent;

    return out;
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

    if (a.insertion !== b.insertion)
        return false;

    if (a.clickEvent?.action !== b.clickEvent?.action)
        return false;

    if (a.clickEvent?.value !== b.clickEvent?.value)
        return false;

    for (let { name } of textModifiersWithoutReset)
        if (a[name] != b[name])
            return false;

    return true;
}

function chatLevelDifferenceAmount(a, b) {
    let difference = 0;

    if (a.color != b.color) difference++;
    if (a.insertion != b.insertion) difference++;
    if (
        (a.clickEvent?.action != b.clickEvent?.action) ||
        (a.clickEvent?.value != b.clickEvent?.value)
    )
        difference++;

    for (const { name } of textModifiersWithoutReset)
        if (a[name] != b[name])
            difference++;

    return difference;
}

module.exports = Text;