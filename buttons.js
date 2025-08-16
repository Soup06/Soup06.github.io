import { displays, shuffle, openPopup } from './sharefn.js';

let darkModeSwitch = document.getElementById("theme-switch");
let luckyButton = document.getElementById("random-display-button");
let editorPageButton = document.getElementById("editor-page-button");
let crashButton = document.getElementById("crash-button");
let homeButton = document.getElementById("main-menu-button");
let displayKeys = null



//Light/dark mode
let theme = localStorage.getItem("theme");
if (!theme) {
    theme = "light";
    localStorage.setItem("theme", "light");
}

if (theme === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}


if (darkModeSwitch){
    //Lets you switch between dark mode and light mode
    darkModeSwitch.addEventListener('click', () => {
        if (window.localStorage.getItem('theme') == "light") {
            window.localStorage.setItem('theme', "dark")
            document.body.classList.add("dark-mode")
        } else if (window.localStorage.getItem('theme') == "dark"){
            window.localStorage.setItem('theme', "light")
            document.body.classList.remove("dark-mode")
        }
    })
}

if (luckyButton){
    //Opens popup with a random display
    luckyButton.addEventListener('click', () => {
        //Finds all the displays in object display
        displayKeys = Object.keys(displays)

        //Shuffles display
        shuffle(displayKeys)
        openPopup(displays[displayKeys[0]])
    });
}

if (editorPageButton){
    editorPageButton.addEventListener('click', () => {
        //<a href="editor.html"></a>
        window.location.href="editor.html"
    })
}

if (crashButton){
    crashButton.addEventListener('click', () => {
    for (i = 0; true; i++){}
    })
}

if (homeButton){
    //Home button to work
    homeButton.addEventListener('click', () => {
        window.location.href="index.html"
    })
}