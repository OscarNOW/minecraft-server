const { Color } = require('minecraft-server');

//All same color
const color1 = new Color(20, 30, 80);
const color2 = new Color({ r: 20, g: 30, b: 80 });
const color3 = new Color('#141e50');
const color4 = new Color({ h: 0.3688, s: 0.6, l: 0.2 })