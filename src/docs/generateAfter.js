const fs = require('fs');
const path = require('path');

let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/assets/custom.css')).toString()
customCss = customCss.replace(/background-image: url(26e93147f10415a0ed4a.svg)/g, '');
fs.writeFileSync(path.resolve(__dirname, '../../docs/assets/custom.css'), customCss);