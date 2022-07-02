const { Color } = require('./');

const color = new Color(20, 30, 80);
console.log(color.rgb) // { r: 20, g: 30, b: 80 }
console.log(color.hex) // "#141e50"

color.rgb.g = 40;

console.log(color.rgb) // { r: 20, g: 40, b: 80 }
console.log(color.hex) // "#142850"