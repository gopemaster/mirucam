const themeSelect = document.getElementById("borderTheme");

const themes = ["none.css", "mac.css", "polaroid.css"]

function changeTheme() {
    document.getElementById("themeStylesheet").setAttribute("href", `./styles/${themes[themeSelect.value]}`);
}