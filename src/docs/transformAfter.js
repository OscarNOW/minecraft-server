const fs = require('fs');
const path = require('path');

let customCss = fs.readFileSync(path.resolve(__dirname, '../../docs/assets/custom.css')).toString()
customCss = customCss.replace('.category__link--ts', '.none');
fs.writeFileSync(path.resolve(__dirname, '../../docs/assets/custom.css'), customCss);