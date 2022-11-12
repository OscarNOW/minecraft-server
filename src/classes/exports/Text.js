const { textModifiers, textColors, keybinds } = require('../../functions/loader/data');
const { language } = require('../../settings.json')

const fs = require('fs');
const path = require('path');

const englishMessages = Object.assign({}, JSON.parse(fs.readFileSync(path.join(__dirname, `../../data/messages/game/${language}.json`)).toString()), JSON.parse(fs.readFileSync(path.join(__dirname, `../../data/messages/realms/${language}.json`)).toString()));

const CustomError = require('../utils/CustomError.js');
const { formatJavaString } = require('../../functions/formatJavaString.js');

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

const defaultInheritedChatProperties = Object.freeze({
    color: 'reset',
    insertion: '',
    clickEvent: { action: 'change_page', value: 0 },
    hoverEvent: { action: 'show_text', value: '' },
    ...Object.fromEntries(textModifiersWithoutReset.map(({ name }) => [name, false]))
});

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

    [Symbol.toPrimitive](hint) {
        if (hint === 'string')
            return this.uncolored;
        else if (hint === 'default')
            return this.array;
        else if (hint === 'number')
            return this.uncolored.length;
        else
            return null;
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

            if (char === '§') {
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

        for (const component of array) {
            const componentText = getTextComponentDefaultText(component);

            if (componentText === '') continue;

            let modCanExtend = true;
            for (const currentModifier of currentModifiers)
                if (!component.modifiers.includes(currentModifier))
                    modCanExtend = false;

            let newMod = [];
            if (modCanExtend)
                for (const modifier of component.modifiers)
                    if (!currentModifiers.includes(modifier))
                        newMod.push(modifier);

            if (component.color === currentColor)
                if (modCanExtend) {
                    currentModifiers = component.modifiers;
                    for (const v of newMod)
                        text += `§${textModifiers.find(({ name }) => name === v).char}`

                    text += componentText
                } else {
                    currentModifiers = component.modifiers;
                    text += '§r'
                    if (component.color != 'default')
                        text += `§${textColors.find(({ name }) => name === component.color).char}`

                    for (const modifier of component.modifiers)
                        text += `§${textModifiers.find(({ name }) => name === modifier).char}`

                    text += componentText
                }
            else if (component.color === 'default') {
                currentColor = 'default'
                currentModifiers = component.modifiers
                text += '§r'

                for (const modifier of component.modifiers)
                    text += `§${textModifiers.find(({ name }) => name === modifier).char}`

                text += componentText;

            } else {
                currentColor = component.color;
                currentModifiers = component.modifiers;

                if (modCanExtend) {
                    text += `§${textColors.find(({ name }) => name === component.color).char}`

                    for (const v of newMod)
                        text += `§${textModifiers.find(({ name }) => name === v).char}`

                    text += componentText;
                } else {
                    text += `§r§${textColors.find(({ name }) => name === component.color).char}`

                    for (const v of component.modifiers)
                        text += `§${textModifiers.find(({ name }) => name === v).char}`

                    text += componentText;
                }

            }
        }

        return text;
    }

    static parseArray(arr) {
        if (!Array.isArray(arr))
            arr = [arr];

        arr = arr.map(parseArrayComponent);

        arr = arr.filter(val => val.text !== '')

        return arr;
    }

    static stringToArray(text) {
        let arr = [];

        let isModifier = false;
        let current = '';
        let currentColor = 'default';
        let currentModifiers = [];

        for (const val of text.split('')) {
            if (isModifier) {
                if (!textColors.find(({ char }) => char === val) && !textModifiers.find(({ char }) => char === val))
                    throw new CustomError('expectationNotMet', 'libraryUser', `colorLetter in  ${this.constructor.name}.stringToArray(<includes colorLetter ${val}>)  `, {
                        got: val,
                        expectationType: 'value',
                        expectation: [...textColors.map(({ char }) => char), ...textModifiers.map(({ char }) => char)],
                    }, Text.stringToArray).toString()
                else {
                    if (textColors.find(({ char }) => char === val)) {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        })
                        current = ''
                        currentColor = textColors.find(({ char }) => char === val).name
                    } else if (textModifiers.find(({ char }) => char === val).name === 'reset') {
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
                        if (!currentModifiers.includes(textModifiers.find(({ char }) => char === val).name)) {
                            let copy = Object.assign([], currentModifiers);
                            arr.push({
                                text: current,
                                color: currentColor,
                                modifiers: copy
                            })
                            current = '';
                            currentModifiers.push(textModifiers.find(({ char }) => char === val).name)
                        }
                    }
                }

                isModifier = false;
                continue;
            }

            if (val === '§')
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

    static arrayToChat(a) { //todo: implement translate
        let array = this.parseArray(a);
        let out;

        for (const v of array) {
            let val = convertArrayComponentToChatComponent(v);

            if (val.text === '') continue;

            if (out === undefined) {
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
                levelDifferences[levelIndex] = chatComponentInheritablePropertiesDifferenceAmount(level, val);
            }

            let lowestDiffLevel = levels[levelDifferences.indexOf(Math.min(...levelDifferences))];

            if (compareChatComponentInheritableProperties(lastLevel, val)) {
                lastLevel.text += val.text;
                continue;
            }

            if (!lowestDiffLevel.extra) lowestDiffLevel.extra = [];
            lowestDiffLevel.extra.push(val);
        }

        if (out === undefined)
            out = { text: '' }

        return this.minifyChat(out);
    }

    static minifyChat(chat) {
        chat = this.parseChat(chat);
        chat = Object.assign({}, chat);

        chat = minifyChatComponent(chat, defaultInheritedChatProperties);

        return chat;
    }

    static parseChat(chat) {
        return deMinifyChatComponent(chat);
    }
}

function parseArrayComponent(component) {
    let out;

    if (['string', 'number', 'boolean'].includes(typeof component))
        out = {
            text: component,
            color: 'default',
            modifiers: []
        }
    else {
        out = {
            color: component.color || 'default',
            modifiers: [...new Set(component.modifiers || [])].sort()
        };

        const [type, value] = getTextComponentTypeValue(component);
        out[type] = value;

        if (type === 'translate' && component.with)
            out.with = component.with.map(parseArrayComponent);

        if (component.insertion)
            out.insertion = component.insertion

        if (
            component.clickEvent &&
            component.clickEvent.action &&
            ['open_url', 'run_command', 'suggest_command', 'change_page'].includes(component.clickEvent.action) &&
            component.clickEvent.value &&
            ['number', 'string'].includes(typeof component.clickEvent.value)
        )
            out.clickEvent = {
                action: component.clickEvent.action,
                value: component.clickEvent.value
            }

        if (
            component.hoverEvent &&
            component.hoverEvent.action &&
            ['show_text'].includes(component.hoverEvent.action) &&
            component.hoverEvent.value &&
            component.hoverEvent.value !== undefined
        )
            out.hoverEvent = {
                action: component.hoverEvent.action,
                value: Text.parseArray(component.hoverEvent.value)
            }
    }

    return out
}

function deMinifyChatComponent(chat) {
    let obj;

    if (['string', 'number', 'boolean'].includes(typeof chat) || chat === null)
        obj = { text: `${chat}` };

    if (Array.isArray(chat))
        obj = { ...chat[0], extra: [...(chat[0].extra || []), ...(chat.slice(1) || [])] };

    if (
        typeof chat === 'object' &&
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
    if (typeof chat != 'object')
        chat = { text: chat };

    let properties = {};
    for (const { name } of [...textModifiersWithoutReset, ...['color', 'insertion', 'clickEvent', 'hoverEvent'].map(a => ({ name: a }))])
        properties[name] = chat[name] ?? inherited[name];

    let overwrittenProperties = {}
    for (const name in properties)
        if (!compareChatComponentInheritableProperty(properties[name], inherited[name], name))
            overwrittenProperties[name] = properties[name]

    for (const name in properties)
        if (overwrittenProperties[name] === undefined)
            delete chat[name]
        else
            chat[name] = overwrittenProperties[name]

    if (chat.hoverEvent)
        chat.hoverEvent.value = minifyChatComponent(chat.hoverEvent.value, defaultInheritedChatProperties)

    if (chat.with)
        chat.with = chat.with.map(a => minifyChatComponent(a, properties));

    if (chat.extra) {
        chat.extra = chat.extra.map(a => minifyChatComponent(a, properties));

        chat = [chat, ...chat.extra];
        delete chat[0].extra;

        if (Object.keys(overwrittenProperties).length === 0 && chat.text !== undefined)
            if (!isNaN(parseInt(chat[0].text)))
                chat[0] = parseInt(chat[0].text)
            else if (chat[0].text === 'true' || chat[0].text === 'false')
                chat[0] = chat[0].text === true
            else
                chat[0] = chat[0].text;

    } else if (Object.keys(overwrittenProperties).length === 0 && chat.text !== undefined)
        if (!isNaN(parseInt(chat.text)))
            chat = parseInt(chat.text)
        else if (chat.text === 'true' || chat.text === 'false')
            chat = Boolean(chat.text)
        else
            chat = chat.text;

    return chat
}

function convertArrayComponentToChatComponent({ with: wit, color, modifiers, insertion, clickEvent, hoverEvent } = {}) {
    let out = {
        color: textColorsWithDefault.find(({ name }) => name === color).minecraftName,
        ...convertModifierArrayToObject(modifiers)
    };

    const [type, value] = getTextComponentTypeValue(arguments[0]);
    out[type] = value;

    if (type === 'translate' && wit)
        out.with = wit.map(convertArrayComponentToChatComponent);

    if (insertion)
        out.insertion = insertion;
    else
        out.insertion = '';

    if (clickEvent)
        out.clickEvent = {
            action: clickEvent.action,
            value: clickEvent.value
        }
    else
        out.clickEvent = {
            action: 'change_page',
            value: 0
        }

    if (hoverEvent)
        out.hoverEvent = {
            action: hoverEvent.action,
            value: Text.arrayToChat(hoverEvent.value)
        }
    else
        out.hoverEvent = {
            action: 'show_text',
            value: ''
        }

    return out;
}

function convertModifierArrayToObject(modifiers) {
    return Object.fromEntries(
        textModifiersWithoutReset
            .map(({ name }) => name)
            .map(a => [a, modifiers.includes(a)])
    );
}

function chatComponentInheritablePropertiesDifferenceAmount(a, b) {
    let difference = 0;

    if (a.color != b.color) difference += `,color:"${b.color}"`.length;
    if (a.insertion != b.insertion)
        if (b.insertion !== undefined)
            difference += `,insertion:"${b.insertion}"`.length;
        else
            difference += `,insertion:""`.length;

    if (
        (a.clickEvent?.action != b.clickEvent?.action) ||
        (a.clickEvent?.value != b.clickEvent?.value)
    )
        if (b.clickEvent !== undefined)
            difference += `,clickEvent:{action:"${b.clickEvent?.action}",value:"${b.clickEvent?.value}"}`.length;
        else
            difference += `,clickEvent:{action:"change_page",value:0}`.length;

    if (
        (a.hoverEvent?.action != b.hoverEvent?.action) ||
        (Boolean(a.hoverEvent) != Boolean(b.hoverEvent)) ||
        ((a.hoverEvent && b.hoverEvent) ? !compareChatComponentInheritableProperties(a.hoverEvent?.value, b.hoverEvent?.value) : false)
    )
        if (b.hoverEvent !== undefined)
            difference += `,hoverEvent:{action:"${b.hoverEvent?.action}",value:${JSON.stringify(b.hoverEvent?.value)}}`.length;
        else
            difference += `,hoverEvent:{action:"show_text",value:""}`.length;

    for (const { name } of textModifiersWithoutReset)
        if (a[name] !== b[name])
            difference += `,${name}:${b[name]}`.length;

    return difference;
}

function compareChatComponentInheritableProperties(a, b) {
    if (typeof a !== typeof b)
        return false;

    if (typeof a != 'object' && typeof b != 'object')
        return a === b;

    if (getTextComponentTypeValue(a)[0] != getTextComponentTypeValue(b)[0])
        return false;

    for (const propertyName of ['color', 'insertion', 'clickEvent', ...textModifiersWithoutReset.map(({ name }) => name), 'hoverEvent'])
        if (!compareChatComponentInheritableProperty(a[propertyName], b[propertyName], propertyName))
            return false;

    return true;
}

function compareChatComponentInheritableProperty(a, b, name) {
    if (typeof a != typeof b) return false;

    if (
        typeof a != 'object' &&
        typeof b != 'object'
    )
        return a === b;

    if (name == 'clickEvent')
        return a.action == b.action && a.value == b.value;

    if (name == 'hoverEvent')
        return a.action == b.action && compareChatComponentInheritableProperties(a.value, b.value);

    //todo: Use CustomError
    throw new Error(`Don't know how to compare ${name}`);
}

function getTextComponentTypeValue(component) {
    if (component.text !== undefined)
        return ['text', component.text];
    else if (component.translate !== undefined)
        return ['translate', component.translate];
    else if (component.keybind !== undefined)
        return ['keybind', component.keybind];
    else
        return ['text', ''];
}

function getTextComponentDefaultText(component) {
    let [type, value] = getTextComponentTypeValue(component);

    if (type == 'text')
        return value;

    if (type == 'translate')
        return formatJavaString(englishMessages[value] ?? value, ...((component.with || []).map(getTextComponentDefaultText)));

    if (type == 'keybind')
        return keybinds.find(({ code }) => code == component.keybind).default;

    throw new Error(`Unknown type ${type}`);
}

module.exports = Text;