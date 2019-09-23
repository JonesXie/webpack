require("./static/home.css")
console.log('this is home');
import logo from "./static/logo.png"

let img = new Image()
img.src = logo;
document.body.appendChild(img)