const fs = require('fs');
const path = require('path');
const version = process.argv[2];

let package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
package.version = version;
fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(package, null, 4));