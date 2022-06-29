module.exports = {
    constructor: [
        {
            code: `
const { Color } = require('./');

//All same color
const color1 = new Color(20, 30, 80);
const color2 = new Color({ r: 20, g: 30, b: 80 });
const color3 = new Color('#141e50');
const color4 = new Color({ h: 0.3688, s: 0.6, l: 0.2 })
`
        },
        {
            code: `
const { Color } = require('./');

const color = new Color(20, 30, 80);
console.log(color.rgb) // { r: 20, g: 30, b: 80 }
console.log(color.hex) // "#141e50"

color.rgb.g = 40;

console.log(color.rgb) // { r: 20, g: 40, b: 80 }
console.log(color.hex) // "#142850"
`
        }
    ]
}