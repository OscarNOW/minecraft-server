const { inspect } = require('util');
const settings = require('../../settings.json');

class CustomError {
    constructor(type, causer, names, { got, expectation, expectationType, externalLink }, context) {
        this.type = type;
        this.causer = causer;
        this.expectationInfo = { got, expectation, expectationType, externalLink };
        this.names = names;
        this.context = context || this.constructor;

        this.error = new Error(this.generateMessage())
        Error.captureStackTrace(this.error, this.context);
    }

    generateMessage() {
        let valueName = this.names.map(([prefix, value, suffix]) => prefix + value + suffix).join(' ');

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

    toString() {
        return this.error;
    }
}

function arrayToText(arr) {
    if (arr.length == 0)
        return valueToText()

    if (arr.length == 1)
        return valueToText(arr[0])

    if (arr.length == 2 && arr.includes(true) && arr.includes(false))
        return typeToText('boolean')

    if (arr.filter(a => typeof a == 'number').length == arr.length && consecutive(arr))
        return `a number between ${arr.sort()[0]} and ${arr.sort()[arr.length - 1]}`

    return `one of ${inspect(arr)}`
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
    let arr = a.sort()

    for (let i = 0; i < arr.length - 1; i++) {
        let d = arr[i + 1] - arr[i];

        if (d != 1)
            return false;
    }

    return true;
}

module.exports = Object.freeze({ CustomError });