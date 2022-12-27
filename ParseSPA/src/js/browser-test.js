// const fs = require('./fs')
const fs = require('fs')
const path = require('path')
console.log(__dirname)
const filePath = path.resolve(__dirname, 'fs.js')
// console.log(fs.readFileSync)
var html = fs.readFileSync(filePath, 'utf8');
console.log(html);