const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
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

const fs = require('fs');
const path = require('path');
const jobs = fs
    .readdirSync(path.join(__dirname, './build/'))
    .map(file => require(path.join(__dirname, './build/', file)));

const progressTypes = ['-', '\\', '|', '/'];
let currentProgress = new Array(jobs.length).fill('.');

let errors = [];

executeJobs(jobs);

async function executeJobs(jobs) {
    let promiseStates = new Array(jobs.length).fill('pending');
    let latestLogs = new Array(jobs.length).fill('');

    const fakePromiseActions = [];
    const fakePromises = new Array(jobs.length).fill(null).map(() => {
        return new Promise((res, rej) => {
            fakePromiseActions.push({ res, rej });
        });
    });

    let promises = jobs.map(job => {
        let update = t => {
            if (t)
                latestLogs[jobs.indexOf(job)] = t.split('\n')[t.split('\n').length - 2];

            updateProgress(jobs.indexOf(job), promiseStates);
            printProgress(errors, latestLogs, promiseStates);
        };

        let error = e => {
            promiseStates[jobs.indexOf(job)] = 'rejected';
            errors.push([job.name, e]);
            latestLogs[jobs.indexOf(job)] = `${colors.fg.red}${e} ${colors.reset}${latestLogs[jobs.indexOf(job)] == '' ? '' : `(${colors.fg.yellow}${latestLogs[jobs.indexOf(job)]}${colors.reset})`}`;
            update();
            fakePromiseActions[jobs.indexOf(job)].res();
        }

        let promise = job(update, { promiseStates, promises: fakePromises, jobs }, error)
            .catch(error)
            .then(v => {
                if (v === false)
                    promiseStates[jobs.indexOf(job)] = 'rejected';
                else {
                    if (promiseStates[jobs.indexOf(job)] == 'pending')
                        promiseStates[jobs.indexOf(job)] = 'resolved';
                    update();
                    fakePromiseActions[jobs.indexOf(job)].res();
                }
            });

        return promise;
    });

    printProgress(errors, latestLogs, promiseStates);

    await Promise.all(promises);
}

function updateProgress(ind, promiseStates) {
    if (promiseStates[ind] == 'resolved')
        currentProgress[ind] = `${colors.fg.green}✓`;
    else if (promiseStates[ind] == 'rejected')
        currentProgress[ind] = `${colors.fg.red}✗`;
    else if (promiseStates[ind] == 'pending') {
        const progressIndex = progressTypes.indexOf(currentProgress[ind]);

        currentProgress[ind] = progressTypes[(progressIndex + 1) % progressTypes.length];
    }
}

function printProgress(errors, latestLogs, promiseStates) {
    const maxJobNameLength = jobs.reduce((max, job) => Math.max(max, job.name.length), 0);

    console.clear()
    for (const i in jobs)
        console.log(`${promiseStates[i] == 'rejected' ? colors.fg.yellow : ''}${jobs[i].name}${colors.reset}:${' '.repeat(maxJobNameLength - jobs[i].name.length)} [${currentProgress[i].repeat(10)}${colors.reset}] ${latestLogs[i]}`);

    if (errors.length > 0) {
        console.log('')
        console.log('Errors:')
        for (const error of errors)
            console.log(...error)
    }
}