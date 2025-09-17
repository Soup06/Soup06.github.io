import { writeDatabase, readDatabase, createScene, storeImage } from './dataBase.js';
import { showNotification, swearCheck } from './sharefn.js';


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
let deleteButton = document.getElementById("tab-delete")
let tagsInput = document.getElementById("input-tags")
let tagsOutput = document.getElementById("output-tags")
let tagsButton = document.getElementById("button-tags")
let imagePreview = document.getElementById("image-preview")
let imageAdressPaste = document.getElementById("image-adress-paste")
let editorMain = document.getElementById("editor-main-page")

let currentTab = "data0"
let oldTab = "data0"
let unknownTabTitle = "(Untitled)"
let saveKey = ""
let allTabs = null
let savedImage = null
let delTab = null

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

    let tab = data[currentTab]

    //Shows the data for the new selected tab
    headerInput.value = tab.header
    bodyInput.value = tab.description

    checkTabs()
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

//Changes the tabs classtab
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

    //--Gets the tags list
    let searchQuery = tagsInput.value;
    let tagsList = searchQuery.match(/[^,\s?]+/g)//(/([abcdefghijklmnopqrstuvwxyz1234567890-]|,)+/)
    //tagsOutput.innerHTML = tagsList;
    console.log(typeof(tagsList))
    
    var birthdayValue = "Unknown"
    
    if (birthdayInput.value != ""){
        birthdayValue = birthdayInput.value
    }

    //Creates an object containing all the requried data
    const displayNew = {
        buttonTitle:nicknameInput.value,
        title:titleInput.value,
        img:imageAdressPaste.value,
        birthday:birthdayValue,
        parents:parentsInput.value,
        info: data,
        reviews: {
        },
        tags: tagsList
    }

    //Sends this display to the database
    createScene(displayNew)
    //Goes to home page
    window.location.href="index.html"
}

//Creates a new tab on click of the tab button
createTabButton.addEventListener('click', () => {
    createNewTab()
})

submitCreatorButton.addEventListener('click', () => {
    let dataToText = JSON.stringify(data);
    console.log(dataToText)
    let textClean = swearCheck([
        nicknameInput.value, 
        titleInput.value, 
        parentsInput.value, 
        tagsInput.value, 
        dataToText])
    ///if (textClean) {submitCreator()}
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
bodyInput.addEventListener("blur", () => {
    //Saves current text to the tab
    saveTabData(currentTab)
});

//Checks when the headerInput bar looses focus, and updates the tab titles
deleteButton.addEventListener("click", () => {
    deleteTab(currentTab)
});

imageAdressPaste.addEventListener('input',function(e){
    imagePreview.src = imageAdressPaste.value
});



/*
fileInput.onchange = function() {
    let savedImage = fileInput.files[0]
    if (savedImage){
        let savedUrl = URL.createObjectURL(savedImage);
        headImg.src = savedUrl
        storeImage(savedImage).then(url => {
            alert("Uploaded! URL: " + url);
        })
    }
}*/
/*
tagsButton.addEventListener('click', () => {
    let searchQuery = tagsInput.value;
    let val = searchQuery.match(/[^,\s?]+/g)//(/([abcdefghijklmnopqrstuvwxyz1234567890-]|,)+/)
    tagsOutput.innerHTML = val;
    console.log(typeof(val))
})*/


createNewTab()
checkTabs()
showNotification("Publicity warning!", 
                "On submition, all text written will be openly shared to public viewing. Users are able to use whatever information you share in any way they desire. <br><br>Please do not submit private information, or anything pottentially offensive. You can find our terms ", 
                'terms.html', 
                "<strong>here.</strong>")
