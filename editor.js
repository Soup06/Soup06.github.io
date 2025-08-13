import { writeDatabase, readDatabase, createScene } from './dataBase.js';


let createTabButton = document.getElementById("create-tab");
let popupTabs = document.getElementById("tab-bar");
let headerInput = document.getElementById("popup-header-input");
let bodyInput = document.getElementById("popup-body-input");
let submitCreatorButton = document.getElementById("submit-creator-button");
let birthdayInput = document.getElementById("popup-birthday-input");
let parentsInput = document.getElementById("popup-parents-input");
let titleInput = document.getElementById("title-input");
let nicknameInput = document.getElementById("nickname-input");
let headImg = document.getElementById("head-img")
let fileInput = document.getElementById("file-input")
let currentTab = "data0"
let oldTab = "data0"
let unknownTabTitle = "(Untitled)"
let saveKey = ""
let allTabs = null

let data = {
    /*info1: {
        header: "Tab One",
        description: ""
    },*/
}

let dataTabs = Object.keys(data)

//alert(data[dataTabs[0]].header)

function createNewTab() {
    let popupTabsAllOf = document.getElementsByClassName("popup-tab")
    if (popupTabsAllOf.length < 7) {
        //Create the tab and the text node inside
        const createTab = document.createElement("div")
        const createTabName = document.createTextNode("")

        //Gives a class to the tab
        createTab.classList.add("popup-tab")

        //Attaches the text to the tab, and the tab to the tab bar
        createTab.appendChild(createTabName)
        popupTabs.appendChild(createTab)


        //This is the Nth tab in the list
        let tabNumber = (dataTabs.length) 

        //Untitles the tab
        createTab.innerHTML = unknownTabTitle;

        //Gets the next key to use for the object (~info1)
        const nextKey = `data${tabNumber}`;

        //Creates a new item in the object and assigns values
        data[nextKey] = {
            header:"",
            description:"",
        }

        //Grabs all the keys in the object
        dataTabs = Object.keys(data)
        createTab.id = nextKey

        //Adds event listener
        createTab.addEventListener('click', () => {
            oldTab = currentTab
            currentTab = createTab.id
            showTabInfo(currentTab, oldTab)
            checkTabs()
        })
    }
 
}

function deleteTab(tabDel){
    document.getElementById(currentTab).remove()
    dataTabs = Object.keys(data)
    delTab = dataTabs[0]
    currentTab=dataTabs[0];
    alert(currentTab)
}

//Correctly sets the title of every tab to the heading of it's info
function updateTabTitles(){
    allTabs = document.querySelectorAll(".popup-tab")
    allTabs.forEach((el) => {
        let obj = el.id;
        if (data[obj]) {
            if (data[obj].header !== "") {
                el.innerHTML = data[obj].header
            } else {
                el.innerHTML = unknownTabTitle
            }
        } 
        
    });
}

//Displays the info from the current tab in the text fields (used when switching tabs)
function showTabInfo(input, last) {
   
    saveTabData(last)

    //
    let tab = data[input]

    //Shows the data for the new selected tab
    headerInput.value = tab.header
    bodyInput.value = tab.description
}

//Saves the current text input data to the correct object
function saveTabData(input) {
    saveKey = input

    //Saves current data to the previos tab
    data[saveKey] = {
        header:headerInput.value,
        description:bodyInput.value,
    }
}

//Changes the tabs class
function checkTabs(){
    let allTabs = document.querySelectorAll(".popup-tab")
    allTabs.forEach((tab) => {
        if (currentTab === tab.id) {
            tab.classList.add("popup-tab-selected")
        }
        else{
            tab.classList.remove("popup-tab-selected")
        }
    })
}

//Submits all the data inside the creator
function submitCreator(){
    const displayNew = {
        buttonTitle:nicknameInput.value,
        title:titleInput.value,
        img:"images/earth.jpeg",
        birthday:birthdayInput.value,
        parents:parentsInput.value,
        info: data,
        reviews: {
        },
        tags: ["planet","space","life","environment","biosphere","resources","solar system","science","nature","astronomy"]
    }
    createScene(displayNew)
}

//Creates a new tab on click of the tab button
createTabButton.addEventListener('click', () => {
    createNewTab()
})

submitCreatorButton.addEventListener('click', () => {
    submitCreator()
})

//Checks when the headerInput bar looses focus, and updates the tab titles
headerInput.addEventListener("blur", () => {
    /*let saveKey = currentTab
    alert(saveKey)
    alert(data[saveKey])
    let selectedThing = currentTab
    data[selectedThing] = {
        header:headerInput.value,
        description:bodyInput.value,
    }*/
    //Saves current text to the tab
    saveTabData(currentTab)
    
    //Updates the tab title text to match the correct data
    updateTabTitles()
});

fileInput.onchange = function() {
    headImg.src = "`${URL.createObjectUrl(fileInput.files[0])}`"
}


createNewTab()
checkTabs()