let verbose = process.argv.includes('--verbose')
let debug = process.argv.includes('--debug')
let silenceWarnings = process.argv.includes('--silence-warnings')
let githubAction = process.argv.includes('--github-action')

if (githubAction) {
    debug = false;
    verbose = false;
    silenceWarnings = false;
}

if (verbose)
    console.log('Getting files...')

const files = require('../src/functions/loader/tests');
const fs = require('fs');
const path = require('path');
const { inspect } = require('util');

const stringify = obj => ({
    text: inspect(obj, undefined, undefined, false),
    color: inspect(obj, undefined, undefined, true)
})

const colors = Object.freeze({
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
});

let testsRun = 0;
let testsFailed = [];
let jsonOut = {
    warnings: [],
    failed: [],
    succeeded: []
};

if (debug) {
    if (!githubAction)
        console.clear();
    console.log('LOGS START\n')
};

(async () => {
    if (verbose)
        console.log('Looping through files...')

    for (const val of files) {
        if (verbose)
            console.log(`  ${val.class}`)

        let index = 0;
        try {
            if (verbose)
                console.log('    Running tests...')

            await val.test((got, expected, id) => {
                testsRun++;

                if (verbose)
                    console.log(`      Test ran`, { testsRun, id })

                if (JSON.stringify(got) != JSON.stringify(expected)) { //todo implement better check
                    if (verbose)
                        console.log('        Test failed')

                    jsonOut.failed.push({
                        got,
                        expected,
                        class: val.class,
                        index,
                        id: id || undefined
                    });
                    testsFailed.push({
                        class: val.class,
                        got: stringify(got),
                        expected: stringify(expected),
                        index,
                        id
                    })
                } else {

                    if (verbose)
                        console.log('        Test succeeded')

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
            }, text => {
                if (verbose)
                    console.log('      Warning gotten', text)

                jsonOut.warnings.push(text);
            })
        } catch (err) {
            if (verbose)
                console.log('Test resulted in error', err)

            if (debug) {
                console.log()
                console.log('TEST RESULTED IN ERROR:')
            }

            throw err
        }
    }

    if (debug) {
        if (githubAction) {
            console.log()
            console.log()
            console.log()
            console.log('TEST SUMMARY')
            console.log()
        } else {
            console.log()
            console.log('LOGS END\nSUMMARY START')
        }
    } else
        console.clear();

    if (verbose)
        console.log('SUMMARY')

    let sumText;
    if (githubAction)
        if (testsRun === 0)
            sumText = 'No tests were found'
        else if (testsFailed.length > 0)
            sumText = `${testsFailed.length} test${testsFailed.length > 1 ? 's' : ''} failed`
        else
            sumText = 'All tests passed'
    else {
        if (testsRun === 0)
            sumText = `${colors.bg.red}${colors.fg.white}${colors.bold} NO TESTS FOUND ${colors.reset}`
        else if (testsFailed.length > 0)
            sumText = `${colors.bg.red}${colors.fg.white}${colors.bold} ${testsRun - testsFailed.length}/${testsRun} TEST${testsRun - testsFailed.length === 1 ? '' : 'S'} SUCCEEDED ${colors.reset}`
        else
            sumText = `${colors.bg.green}${colors.fg.black}${colors.bold} ALL TESTS SUCCEEDED ${colors.reset}`
    }

    if (!verbose) {
        console.log(sumText)
        console.log()
    }

    if (githubAction) {
        for (const testFailed of testsFailed) {
            console.log()
            console.log('FAILED TEST SUMMARY')
            console.log(`  GOT:       ${testFailed.got.text} `)
            console.log(`  EXPECTED:  ${testFailed.expected.text} `)
            console.log(`  CLASS:     ${testFailed.class}`)

            if (testFailed.id)
                console.log(`  ID:       ${testFailed.id} `)
            else
                console.log(`  INDEX:    ${testFailed.index} `)
        }
    } else {
        if (testsFailed.length > 0)
            console.log('/----------------------------\\')

        testsFailed.forEach((val, ind) => {
            let colArr = [];
            let arr = [];

            colArr.push(`| ${colors.bg.red}${colors.bold} FAILED `)
            arr.push(`|  FAILED `)
            colArr.push(`| GOT:      ${colors.bg.black} ${val.got.color} `)
            arr.push(`| GOT:       ${val.got.text} `)
            colArr.push(`| EXPECTED: ${colors.bg.black} ${val.expected.color} `)
            arr.push(`| EXPECTED:  ${val.expected.text} `)
            colArr.push(`| CLASS:    ${colors.fg.yellow}${val.class}`)
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

            if (ind === testsFailed.length - 1)
                console.log('\\----------------------------/')
            else
                console.log('+----------------------------+')
        })
    }

    if (!githubAction)
        if (testsFailed.length > 0) {
            console.log()
            console.log(sumText)

            fs.mkdirSync(path.resolve(__dirname, '../logs/tests/'), { recursive: true })

            let p = path.resolve(__dirname, `../logs/tests/latest.json`);
            fs.writeFileSync(p, JSON.stringify(jsonOut, null, 4));
            console.log(p)

            console.log()
        }

    if (!silenceWarnings & jsonOut.warnings.length > 0) {
        if (githubAction)
            console.log(`WARNINGS`)
        else
            console.log(`${colors.bg.yellow}${colors.fg.black} WARNINGS ${colors.reset}`)
        for (const v of jsonOut.warnings) console.log(v)
        console.log();
    }

    if (githubAction && (testsFailed.length > 0 || testsRun.length === 0))
        process.exit(1);
})();