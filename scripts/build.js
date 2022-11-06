const wait = ms => new Promise(res => setTimeout(res, ms));
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

const jobs = [
    updateVersionFiles,
    readme,
    minify,
    typeDocs
];

const progressTypes = ['-', '\\', '|', '/'];
let currentProgress = new Array(jobs.length).fill('.');

let errors = [];

executeJobs(jobs);

async function executeJobs(jobs) {
    let promiseStates = new Array(jobs.length).fill('pending');
    let promises = jobs.map(job => {
        let update = () => {
            updateProgress(jobs.indexOf(job), promiseStates);
            printProgress(errors);
        };

        let promise = job(update)
            .catch(e => {
                promiseStates[jobs.indexOf(job)] = 'rejected';
                errors.push(e);
                update();
            })
            .then(() => {
                if (promiseStates[jobs.indexOf(job)] == 'pending')
                    promiseStates[jobs.indexOf(job)] = 'resolved';
                update();
            });

        return promise;
    });

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

function printProgress(errors) {
    const maxJobNameLength = jobs.reduce((max, job) => Math.max(max, job.name.length), 0);

    console.clear()
    for (const i in jobs)
        console.log(`${jobs[i].name}:${' '.repeat(maxJobNameLength - jobs[i].name.length)} [${currentProgress[i].repeat(10)}${colors.reset}]`);

    if (errors.length > 0) {
        console.log('')
        console.log('Errors:')
        for (const error of errors)
            console.log(error)
    }
}

async function updateVersionFiles(update) {
    update();
    let int = setInterval(update, 500);
    await wait(5000);
    clearInterval(int);
    update();
}

async function readme(update) {
    update();
    let int = setInterval(update, 500);
    await wait(4000);
    clearInterval(int);
    update();
}

async function minify(update) {
    update();
    let int = setInterval(update, 500);
    await wait(3000);
    clearInterval(int);
    update();
}

async function typeDocs(update) {
    update();
    let int = setInterval(update, 500);
    await wait(1250);
    clearInterval(int);
    update();

    throw 1;
}