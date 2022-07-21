function toggleHamburger() {
  let menu = document.getElementById("hamburger_menu")
console.log(menu.style.visibility)
  if (menu.style.visibility === "hidden") {
    menu.style.visibility = "visible"
  } else {
    menu.style.visibility = "hidden"
  }
}