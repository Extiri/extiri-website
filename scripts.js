function toggleHamburger() {
  let menu = document.getElementById("hamburger_menu")

  if (menu.style.visibility === "hidden" || menu.style.visibility === "") {
    menu.style.visibility = "visible"
  } else {
    menu.style.visibility = "hidden"
  }
}
