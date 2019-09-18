const hello = require('./a.js')
const world = require('./b.js')
require("./a.css")
require("./a.scss")
console.log(hello.hello + " " + world.world)

let fn = () => {
  console.log(11)
}
fn()
'xxxaaa'.includes('a')

import logo from "./logo.jpg"

let img = new Image()
img.src = logo;
document.body.appendChild(img)