let createTabButton = document.getElementById("create-tab");
let popupTabs = document.getElementById("tab-bar");


function createNewTab() {

    //Create the tab and the text node inside
    const createTab = document.createElement("div")
    const createTabName = document.createTextNode("(empty)")

    //Gives a class to the tab
    createTab.classList.add("popup-tab")

    //Attaches the text to the tab, and the tab to the tab bar
    createTab.appendChild(createTabName)
    popupTabs.appendChild(createTab)

 
}




createTabButton.addEventListener('click', () => {
    createNewTab()
})