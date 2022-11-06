const wait = ms => new Promise(res => setTimeout(res, ms));

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
            printProgress();
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

    printErrors(errors);
}

function updateProgress(ind, promiseStates) {
    if (promiseStates[ind] == 'resolved')
        currentProgress[ind] = '✓';
    else if (promiseStates[ind] == 'rejected')
        currentProgress[ind] = '✗';
    else if (promiseStates[ind] == 'pending') {
        const progressIndex = progressTypes.indexOf(currentProgress[ind]);

        currentProgress[ind] = progressTypes[(progressIndex + 1) % progressTypes.length];
    }
}

function printProgress() {
    const maxJobNameLength = jobs.reduce((max, job) => Math.max(max, job.name.length), 0);

    console.clear()
    for (const i in jobs)
        console.log(`${jobs[i].name}:${' '.repeat(maxJobNameLength - jobs[i].name.length)} [${currentProgress[i].repeat(10)}]`);
}

function printErrors(errors) {
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
}