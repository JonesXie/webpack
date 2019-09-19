console.log("index");

let button = document.createElement('button')
button.innerHTML = "name"
button.addEventListener('click', () => {
  import('./loader').then((data) => {
    console.log(data.default)
  })
})
document.body.appendChild(button)