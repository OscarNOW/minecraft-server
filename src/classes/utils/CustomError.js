const { inspect } = require('util');
const settings = require('../../settings.json');

class CustomError {
    constructor(type, causer, valueName, { got, expectation, expectationType, externalLink } = {}, context, { server, client } = {}) {
        this.type = type;
        this.causer = causer;
        this.expectationInfo = { got, expectation, expectationType, externalLink };
        this.valueName = valueName;
        this.context = context || this.constructor;

        if (server)
            this.server = server;
        if (client)
            this.client = client;

        this.error = new Error(this.generateMessage())
        Error.captureStackTrace(this.error, this.context);
    }

    generateMessage() {
        let valueName = this.valueName;

        let got = valueToText(this.expectationInfo.got);

        let expected;
        if (this.expectationInfo.expectationType == 'value')
            expected = arrayToText(this.expectationInfo.expectation)
        else
            expected = typeToText(this.expectationInfo.expectation, this.expectationInfo.externalLink)

        let causer;
        if (this.causer == 'client')
            causer = 'Minecraft Client'
        else if (this.causer == 'libraryUser')
            causer = 'Library User (probably you)'
        else if (this.causer == 'library')
            causer == 'Library itself. Please report this issue on Github (https://github.com/OscarNOW/minecraft-server/issues/new/choose)'

        if (this.type == 'expectationNotMet')
            return `Unknown ${valueName}, got ${got}, expected ${expected}. Program that caused this error: ${causer}`;
    }

    [Symbol.toPrimitive](hint) {
        if (hint == 'string')
            return this.error;
        else if (hint == 'default')
            return this.error;
        else if (hint == 'number')
            return NaN;
        else
            return null;
    }
}

function arrayToText(ar) {
    let arr = ar;

    arr = sortArray(arr)

    if (arr.length == 0)
        return valueToText()

    if (arr.length == 1)
        return valueToText(arr[0])

    if (arr.length == 2 && arr.includes(true) && arr.includes(false))
        return typeToText('boolean')

    if (arr.filter(a => typeof a == 'number').length == arr.length && consecutive(arr))
        return `a number between ${arr.sort()[0]} and ${arr.sort()[arr.length - 1]}`

    return `one of ${inspect(arr, { sorted: false })}`
}

function typeToText(type, externalLink) {
    let out = `typeof ${type}`
    if (externalLink)
        out += ` (${parseUri(externalLink)})`

    return out
}

function valueToText(value) {
    if (value === undefined)
        return 'nothing'

    return `${inspect(value)} (${typeof value})`
}

function parseUri(uri) {
    return uri.replace(/\{docs\}/g, settings.links.docs)
}

function consecutive(a) {
    let arr = sortArray(a);

    for (let i = 0; i < arr.length - 1; i++) {
        let d = arr[i + 1] - arr[i];

        if (d != 1)
            return false;
    }

    return true;
}

function sortArray(a) {
    let arr = Object.assign([], a);

    if (arr.filter(a => !isNaN(parseInt(a))).length == arr.length)
        arr = arr.map(a => parseInt(a))

    if (arr.filter(a => typeof a == 'number').length == arr.length)
        arr = arr.sort((a, b) => a - b)
    else
        arr = arr.sort();

    return arr;
}

module.exports = CustomError