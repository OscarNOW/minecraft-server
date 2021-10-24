const maxObjectLength = 100;
const preferredObjectLength = 14;
const files = require('./functions/loader/tests');
const fs = require('fs');
const path = require('path');

function tof(obj) {
    if (['string', 'bigint', 'boolean', 'function', 'symbol'].includes(typeof obj)) return typeof obj;
    if (typeof obj == 'number')
        if (isNaN(obj))
            return 'none'
        else
            return 'number'
    else if (typeof obj == 'object')
        if (JSON.stringify(obj).startsWith('{'))
            return 'object'
        else if (JSON.stringify(obj).startsWith('['))
            return 'array'
        else if (obj === null)
            return 'none'
        else
            throw new Error('Unknown object type')
    else if (typeof obj == 'undefined')
        return 'none'
}

const stringify = {
    general(obj, short) {
        let type = tof(obj);
        if (stringify[type]) return stringify[type](obj, short);
        return `${obj}`;
    },
    object(obj, short) {
        if (JSON.stringify(obj) == '{}') return '{}';

        let out = `{${short ? '' : ' '}`;
        for (const [key, value] of Object.entries(obj))
            if (out == `{${short ? '' : ' '}`)
                out += `${key}: ${stringify.general(value, short)}`
            else
                out += `,${short ? '' : ' '}${key}: ${stringify.general(value, short)}`
        out += `${short ? '' : ' '}}`
        return out
    },
    array(arr, short) {
        if (JSON.stringify(arr) == '[]') return '[]';

        let out = `[${short ? '' : ' '}`;
        // out += arr.join(`,${short ? '' : ' '}`)
        arr.forEach((val, ind) => {
            out += `${ind == 0 ? '' : `,${short ? '' : ' '}`}${stringify.general(val, short)}`
        })
        out += `${short ? '' : ' '}]`
        return out
    },
    string(str, short) {
        if (str === '' | str.includes(',') | str.includes('"') | str.includes("'") | str.includes('`'))
            if (short)
                if (!str.includes("'"))
                    return `'${str}'`
                else if (!str.includes('"'))
                    return `"${str}"`
                else if (!str.includes('`'))
                    return `\`${str}\``
                else
                    return `'${str}'`
            else
                if (!str.includes('"'))
                    return `"${str}"`
                else if (!str.includes("'"))
                    return `'${str}'`
                else if (!str.includes('`'))
                    return `\`${str}\``
                else
                    return `"${str}""`
        else
            return str
    }
}

const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m"
    }
}

const verbose = process.argv.includes('--verbose')
const debug = process.argv.includes('--debug')
let testsRun = 0;
let testsFailed = [];
let jsonOut = {
    failed: [],
    succeeded: []
};

if (debug) {
    console.clear()
    console.log('LOGS START\n')
};

(async () => {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const val = files[fileIndex];
        let index = 0;
        await val.test((got, expected, id) => {
            testsRun++;
            if (JSON.stringify(got) != JSON.stringify(expected)) {
                let o2 = {
                    got,
                    expected,
                    class: val.class,
                    index
                };
                if (id) o2.id = id;
                jsonOut.failed.push(o2);
                testsFailed.push({
                    class: val.class,
                    got:
                        (stringify.general(got, false).length < preferredObjectLength) ?
                            stringify.general(got, false) :
                            (stringify.general(got, true).length < preferredObjectLength) ?
                                stringify.general(got, true) :
                                (stringify.general(got, false).length < maxObjectLength) ?
                                    stringify.general(got, false) :
                                    (stringify.general(got, true).length < maxObjectLength) ?
                                        stringify.general(got, true) :
                                        tof(got),
                    expected:
                        (stringify.general(expected, false).length < preferredObjectLength) ?
                            stringify.general(expected, false) :
                            (stringify.general(expected, true).length < preferredObjectLength) ?
                                stringify.general(expected, true) :
                                (stringify.general(expected, false).length < maxObjectLength) ?
                                    stringify.general(expected, false) :
                                    (stringify.general(expected, true).length < maxObjectLength) ?
                                        stringify.general(expected, true) :
                                        tof(expected),
                    index,
                    id
                })
            } else {
                let o2 = {
                    expected,
                    got,
                    class: val.class,
                    index
                };
                if (id) o2.id = id;
                jsonOut.succeeded.push(o2);
            }
            index++;
        })
    }

    if (debug) {
        console.log()
        console.log('LOGS END\nSUMMARY START')
    } else
        console.clear();
    let sumText;
    if (testsRun == 0)
        sumText = `${colors.bg.red}${colors.fg.white}${colors.bold} NO TESTS FOUND ${colors.reset}`
    else if (testsFailed.length > 0)
        sumText = `${colors.bg.red}${colors.fg.white}${colors.bold} ${testsRun - testsFailed.length}/${testsRun} TEST${testsRun - testsFailed.length == 1 ? '' : 'S'} SUCCEEDED ${colors.reset}`
    else
        sumText = `${colors.bg.green}${colors.fg.black}${colors.bold} ALL TESTS SUCCEEDED ${colors.reset}`
    if (!verbose) {
        console.log(sumText)
        console.log()
    }

    if (!verbose) {
        if (testsFailed.length > 0)
            console.log('/----------------------------\\')

        testsFailed.forEach((val, ind) => {
            let colArr = [];
            let arr = [];

            colArr.push(`| ${colors.bg.red}${colors.bold} FAILED `)
            arr.push(`|  FAILED `)
            colArr.push(`| GOT:      ${colors.bg.magenta}${colors.fg.black} ${val.got} `)
            arr.push(`| GOT:       ${val.got} `)
            colArr.push(`| EXPECTED: ${colors.bg.magenta}${colors.fg.black} ${val.expected} `)
            arr.push(`| EXPECTED:  ${val.expected} `)
            colArr.push(`| CLASS:    ${colors.fg.yellow}${colors.bold}${val.class}`)
            arr.push(`| CLASS:    ${val.class}`)
            if (val.id) {
                colArr.push(`| ID:      ${colors.fg.yellow}${colors.bold} ${val.id} `)
                arr.push(`| ID:       ${val.id} `)
            } else {
                colArr.push(`| INDEX:   ${colors.fg.yellow}${colors.bold} ${val.index} `)
                arr.push(`| INDEX:    ${val.index} `)
            }

            colArr.forEach((val, ind) => {
                let spaces = '';
                for (let ii = 0; ii < 29 - arr[ind].length; ii++)
                    spaces += ' ';

                console.log(val + colors.reset + spaces + (arr[ind].length > 29 ? '' : '|'))
            })

            if (ind == testsFailed.length - 1)
                console.log('\\----------------------------/')
            else
                console.log('+----------------------------+')
        })
    }

    if (testsFailed.length > 0) {
        console.log()
        console.log(sumText)

        // let p = path.resolve(__dirname, `./logs/tests/${Math.floor(Math.random() * 100000)}.json`);
        let p = path.resolve(__dirname, `./logs/tests/latest.json`);
        fs.writeFileSync(p, JSON.stringify(jsonOut, null, 4));
        console.log(p)

        console.log()
    }
})();