const { textModifiers, textColors, keybinds } = require('../../functions/loader/data');
const { language } = require('../../settings.json');

const fs = require('fs');
const path = require('path');

const CustomError = require('../utils/CustomError.js');
const { formatJavaString } = require('../../functions/formatJavaString.js');

const englishMessages = Object.assign({},
    JSON.parse(
        fs.readFileSync(
            path.join(__dirname, `../../data/messages/game/${language}.json`)
        ).toString()
    ),
    JSON.parse(
        fs.readFileSync(
            path.join(__dirname, `../../data/messages/realms/${language}.json`)
        ).toString()
    )
);

const textModifiersWithoutReset = textModifiers.filter(({ name }) => name !== 'reset');
const textColorsWithDefault = [...textColors, { char: 'r', name: 'default', minecraftName: 'reset' }];

const hiddenProperties = [
    '_input',
    '_string',
    '_uncolored',
    '_array',
    '_chat',
    '_hash'
];

const _p = Symbol('_privates')
const events = Object.freeze([
    'change'
]);

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
    constructor(text) {
        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });

        for (const hiddenProperty of hiddenProperties)
            this.p[hiddenProperty] = null;

        this.p._input = text || '';

        this.events = Object.freeze(Object.fromEntries(events.map(a => [a, []])));

        for (const [name, { get, set }] of Object.entries(properties))
            Object.defineProperty(this, name, {
                configurable: false,
                enumerable: true,
                get,
                set
            });

        this.p.reset = () => {
            for (const hiddenProperty of hiddenProperties)
                this[hiddenProperty] = null;
        };

        this.p.emitChange = () => {
            for (const { callback } of this.events.change)
                callback(this);
        };
    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected access to private properties from outside of the module. This is not recommended and may cause unexpected behavior.');

        return this[_p];
    }

    set p(value) {
        console.error('(minecraft-server) ERROR: Setting private properties is not supported. Action ignored.');
    }

    removeAllListeners(event) {
        if (event)
            this.events[event] = [];
        else
            for (const event of Object.keys(this.events))
                this.events[event] = [];
    }

    on(event, callback) {
        if (!this.events[event])
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.on(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: Object.keys(this.events)
            }, this.on));

        this.events[event].push({ callback, once: false });
    }

    once(event, callback) {
        if (!this.events[event])
            this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `event in  <${this.constructor.name}>.once(${require('util').inspect(event)}, ...)  `, {
                got: event,
                expectationType: 'value',
                expectation: Object.keys(this.events)
            }, this.on));

        this.events[event].push({ callback, once: true });
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

        return out;
    }

    static arrayToString(a) {
        let array = Text.parseArray(a);

        let text = '§r';
        let currentModifiers = [];
        let currentColor = 'default';

        for (const component of array) {
            const innerText = getTextComponentDefaultInnerText(component);
            if (innerText === '') continue;

            text += getStringChangeCharacters({
                color: currentColor,
                modifiers: currentModifiers
            }, component);
            text += innerText;

            currentModifiers = component.modifiers;
            currentColor = component.color;
        }

        // when using translate component with 'with', unnecessary change characters could be left
        // at the end of 'with' components, because they don't know their outside modifiers,
        // so we reparse it to an array and back so those unnecessary characters are removed
        if (array.some(component => {
            const [type] = getTextComponentTypeValue(component);
            return type === 'translate' && component.with && component.with.length > 0;
        }))
            text = Text.arrayToString(Text.stringToArray(text));

        return text;
    }

    static parseArray(arr) {
        if (!Array.isArray(arr)) arr = [arr];
        arr = arr.map(parseArrayComponent);
        arr = arr.filter(val => val.text !== '');

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
                        expectation: [...textColors.map(({ char }) => char), ...textModifiers.map(({ char }) => char)]
                    }, Text.stringToArray).toString()
                else {
                    if (textColors.find(({ char }) => char === val)) {
                        let copy = Object.assign([], currentModifiers);
                        arr.push({
                            text: current,
                            color: currentColor,
                            modifiers: copy
                        });
                        current = '';
                        currentColor = textColors.find(({ char }) => char === val).name;
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
                            });
                            current = '';
                            currentModifiers.push(textModifiers.find(({ char }) => char === val).name);
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
        });

        return Text.parseArray(arr);
    }

    static arrayToChat(a) { // todo: "implement translate" is the todo that was here. After testing, translate seems to be working fine. Needs further testing and looking.
        let array = Text.parseArray(a);
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
                levels.push(lastLevel);
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
            out = { text: '' };

        return Text.minifyChat(out);
    }

    static minifyChat(chat) {
        chat = Text.parseChat(chat);
        chat = Object.assign({}, chat);

        chat = minifyChatComponent(chat, defaultInheritedChatProperties);

        return chat;
    }

    static parseChat(chat) {
        return deMinifyChatComponent(chat);
    }
}

function stringCanExtend(currentComponent, newComponent) {
    for (const currentModifier of currentComponent.modifiers)
        if (!newComponent.modifiers.includes(currentModifier))
            return false;

    if (newComponent.color !== currentComponent.color && newComponent.color === 'default')
        return false;

    return true;
}

function getStringChangeCharacters(currentComponent, newComponent) {
    let text = '';

    const canExtend = stringCanExtend(currentComponent, newComponent);

    let newMod = [];
    if (canExtend) {
        for (const modifier of newComponent.modifiers)
            if (!currentComponent.modifiers.includes(modifier))
                newMod.push(modifier);
    } else
        newMod = newComponent.modifiers;

    if (canExtend) {
        if (newComponent.color !== currentComponent.color)
            text += `§${textColors.find(({ name }) => name === newComponent.color).char}`;
    } else {
        text += '§r';
        if (newComponent.color !== 'default')
            text += `§${textColors.find(({ name }) => name === newComponent.color).char}`;
    }

    for (const mod of newMod)
        text += `§${textModifiers.find(({ name }) => name === mod).char}`;

    return text;
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
        let modifiers = component.modifiers;
        if (!modifiers) modifiers = [];
        if (!Array.isArray(modifiers)) modifiers = [modifiers];
        modifiers = [...new Set(modifiers)].sort();

        out = {
            color: component.color || 'default',
            modifiers
        }

        const [type, value] = getTextComponentTypeValue(component);
        out[type] = value;

        if (type === 'translate' && component.with) {
            if (!Array.isArray(out.with))
                out.with = [out.with];

            out.with = component.with.map(parseArrayComponent);
        }

        if (component.insertion)
            out.insertion = component.insertion;

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

        if (component.hoverText)
            out.hoverText = Text.parseArray(component.hoverText);
    }

    return out;
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
        chat !== null
    )
        obj = chat;

    for (const extra in obj.extra || [])
        obj.extra[extra] = deMinifyChatComponent(obj.extra[extra]);

    return obj;
};

function minifyChatComponent(chat, inherited) {
    if (typeof chat !== 'object')
        chat = { text: chat };

    let properties = {};
    for (const { name } of [...textModifiersWithoutReset, ...['color', 'insertion', 'clickEvent', 'hoverEvent'].map(a => ({ name: a }))])
        properties[name] = chat[name] ?? inherited[name];

    let overwrittenProperties = {}
    for (const name in properties)
        if (!compareChatComponentInheritableProperty(properties[name], inherited[name], name))
            overwrittenProperties[name] = properties[name];

    for (const name in properties)
        if (overwrittenProperties[name] === undefined)
            delete chat[name];
        else
            chat[name] = overwrittenProperties[name];

    if (chat.hoverEvent)
        chat.hoverEvent.value = minifyChatComponent(chat.hoverEvent.value, defaultInheritedChatProperties);

    if (chat.with)
        chat.with = chat.with.map(a => minifyChatComponent(a, properties));

    if (chat.extra) {
        chat.extra = chat.extra.map(a => minifyChatComponent(a, properties));

        chat = [chat, ...chat.extra];
        delete chat[0].extra;

        if (Object.keys(overwrittenProperties).length === 0 && chat.text !== undefined)
            chat[0] = convertChatComponentTextToPrimitive(chat[0].text);

    } else if (Object.keys(overwrittenProperties).length === 0 && chat.text !== undefined)
        chat = convertChatComponentTextToPrimitive(chat.text);

    return chat;
}

function convertArrayComponentToChatComponent({ with: wit, color, modifiers, insertion, clickEvent, hoverText } = {}) {
    let out = {
        color: textColorsWithDefault.find(({ name }) => name === color).minecraftName,
        ...convertModifierArrayToObject(modifiers)
    };

    //todo: split following code into separate function

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

    if (hoverText)
        out.hoverEvent = {
            action: 'show_text',
            value: Text.arrayToChat(hoverText)
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

function convertChatComponentTextToPrimitive(text) {
    if (!isNaN(parseInt(text)))
        return parseInt(text);
    else if (text === 'true' || text === 'false')
        return text === 'true';
    else
        return text;
}

function chatComponentInheritablePropertiesDifferenceAmount(a, b) {
    let difference = 0;

    if (a.color !== b.color) difference += `,color:${JSON.stringify(b.color)}`.length;
    if (a.insertion !== b.insertion)
        if (b.insertion !== undefined)
            difference += `,insertion:${JSON.stringify(b.insertion)}`.length;
        else
            difference += ',insertion:""'.length;

    if (
        (a.clickEvent?.action !== b.clickEvent?.action) ||
        (a.clickEvent?.value !== b.clickEvent?.value)
    )
        if (b.clickEvent !== undefined)
            difference += `,clickEvent:{action:${JSON.stringify(b.clickEvent?.action)},value:${JSON.stringify(b.clickEvent?.value)}}`.length;
        else
            difference += ',clickEvent:{action:"change_page",value:0}'.length;

    if (
        (a.hoverEvent?.action !== b.hoverEvent?.action) ||
        (Boolean(a.hoverEvent) !== Boolean(b.hoverEvent)) ||
        ((a.hoverEvent && b.hoverEvent) ? !compareChatComponentInheritableProperties(a.hoverEvent?.value, b.hoverEvent?.value) : false)
    )
        if (b.hoverEvent !== undefined)
            difference += `,hoverEvent:{action:${JSON.stringify(b.hoverEvent?.action)},value:${JSON.stringify(b.hoverEvent?.value)}}`.length;
        else
            difference += ',hoverEvent:{action:"show_text",value:""}'.length;

    for (const { name } of textModifiersWithoutReset)
        if (a[name] !== b[name])
            difference += `,${name}:${JSON.stringify(b[name])}`.length;

    return difference;
}

function compareChatComponentInheritableProperties(a, b) {
    if (typeof a !== typeof b)
        return false;

    if (typeof a !== 'object' && typeof b !== 'object')
        return a === b;

    if (getTextComponentTypeValue(a)[0] !== getTextComponentTypeValue(b)[0])
        return false;

    for (const propertyName of ['color', 'insertion', 'clickEvent', ...textModifiersWithoutReset.map(({ name }) => name), 'hoverEvent'])
        if (!compareChatComponentInheritableProperty(a[propertyName], b[propertyName], propertyName))
            return false;

    return true;
}

function compareChatComponentInheritableProperty(a, b, name) {
    if (typeof a !== typeof b) return false;

    if (
        typeof a !== 'object' &&
        typeof b !== 'object'
    )
        return a === b;

    if (name === 'clickEvent')
        return a.action === b.action && a.value === b.value;

    if (name === 'hoverEvent')
        return a.action === b.action && compareChatComponentInheritableProperties(a.value, b.value);

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

function getTextComponentDefaultInnerText(component) {
    let [type, value] = getTextComponentTypeValue(component);

    if (type === 'text')
        return value;

    if (type === 'translate') {
        const withTexts = (component.with || []).map(currentComponent => {
            let text = Text.arrayToString(currentComponent);

            // add reset characters at the end of the string, so that the style returns to the original text
            text += getStringChangeCharacters(currentComponent, component);

            return text;
        });
        return formatJavaString(englishMessages[value] ?? value, ...withTexts);
    }

    if (type === 'keybind')
        return keybinds.find(({ code }) => code === component.keybind).default;

    throw new Error(`Unknown type ${type}`);
}

module.exports = Text;