const fs = require('fs');
const path = require('path');

let data = {};
let utilClasses = {};
let localClasses = {};

fs.readdirSync('./src/classes/exports/').forEach(file => {
    if (file.split('.').length == 3 && file.endsWith('.d.ts')) {
        let contents = fs.readFileSync(`./src/classes/exports/${file}`).toString();
        let done = false;
        let bracketCount = 0;
        let exported = '';
        let exporting = false;

        const c = contents.split('').filter(v => v != '\r');
        c.forEach((v, i) => {
            if (done) return;

            if (file == 'Text.d.ts')
                console.log({ done, exporting, v, bracketCount })

            if (exporting) {
                if (v == '{') bracketCount++;
                if (v == '}') bracketCount--;

                if (v == '}' && bracketCount == 1) {
                    exported += v;
                    exporting = false;
                    done = true;
                }

                return exported += v;
            }

            if (i + 6 <= contents.split('').length - 1) {
                let matches = true;

                if (c[i] != 'c') matches = false;
                if (c[i + 1] != 'l') matches = false;
                if (c[i + 2] != 'a') matches = false;
                if (c[i + 3] != 's') matches = false;
                if (c[i + 4] != 's') matches = false;
                if (c[i + 5] != ' ') matches = false;

                if (matches) {
                    exporting = true;
                    exported += c[i];
                }
            }
        })

        // if (file == 'Text.d.ts')
        //     console.log(exported)
    }
})

// fs.readdirSync(path.resolve(__dirname, '../../classes/utils/')).forEach(file => {
//     if (file.split('.').length == 2)
//         utils = { ...utils, ...require(`../../classes/utils/${file}`) }
// })