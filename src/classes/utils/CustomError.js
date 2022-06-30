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
        if (this.type == 'expectationNotMet')
            return `Unknown ${this.names.map(([prefix, value, suffix]) => prefix + value + suffix).join(' ')}, got ${this.expectationInfo.got === undefined ? 'nothing' : `${inspect(this.expectationInfo.got)} (${typeof this.expectationInfo.got})`}, expected ${this.expectationInfo.expectationType == 'value' ? `one of ${inspect(this.expectationInfo.expectation)}` : `type is ${this.expectationInfo.expectation}${this.expectationInfo.externalLink ? ` (${this.expectationInfo.externalLink.replace(/\{docs\}/g, settings.links.docs)})` : ''}`}. Program that caused this error: ${{ client: 'Minecraft Client', libraryUser: 'Library User (probably you)', library: 'Library itself. Please report this issue on Github (https://github.com/OscarNOW/minecraft-server/issues/new/choose)' }[this.causer]}`;
    }

    toString() {
        return this.error;
    }
}

module.exports = Object.freeze({ CustomError });