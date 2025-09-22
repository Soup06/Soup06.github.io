import { writeDatabase, readDatabase, setReview } from './dataBase.js';
import { bannedWords } from './swears.js'; 
import { ref, push } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

let popupBody = document.getElementById("popup-body"); 
let popupBodyHeader = document.getElementById("popup-body-header");
let popupBodyDescription = document.querySelector(".popup-body-description");
let btn = document.getElementsByClassName("scene-view-flex-box");
let closeBtn = document.getElementById("close-popup");
let popupHeadImg = document.getElementById("image-display");
let popupTabs = document.getElementById("tab-bar");
let popupTabsAll = document.querySelectorAll(".popup-tab");
let birthdayField = document.getElementById("popup-birthday");
let parentsField = document.getElementById("popup-parents");
let reviewInputBox = document.getElementById("review-input");
let mainArea = document.querySelector(".section-layer");
let starSelectors = document.querySelectorAll(".star-selector");
let searchBar = document.getElementById("searchField");
let reviewSubmitButton = document.getElementById("review-submit");
let reviewersText = document.getElementById("reviewers-quantity");
let reviewRatingAverage = document.getElementById("review-avg-number");
let reviewStarsAverage = document.getElementById("review-avg-stars");
let popupScrollSection = document.getElementById("popup-scrollable");
let editorMain = document.getElementById("editor-main-page");
let notifArea = document.getElementById("notif-area")

//Used for reviews
let starRating = undefined;
//Current data used for display
let currentDisplay = 0;
let currentDisplayKey = 0;

let displays = {}

//Testing banned word list
//let bannedWords = ["word", "horse"]

//Shuffles an array 
/*
function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}*/
function shuffle(array) {
    let currIndex = array.length;

    while (currIndex != 0) {
        let randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;

        [array[currIndex], array[randIndex]] = [
            array[randIndex], array[currIndex]
        ];
    }
}

//Opens the popup window
function openPopup(subjectObject, subjectKey) {

    //Resets the review text
    reviewInputBox.value = ""
    starRating = undefined
    starSelectors.forEach((a) => {
        a.innerHTML = "&#x2606"
    })
    //alert(subjectObject)
    let makeTabs = Object.keys(subjectObject.info)
    currentDisplay = subjectObject
    currentDisplayKey = subjectKey
    //alert(currentDisplayKey)

    dimmer.style.display = "block";
    //dimmer.classList.add("dimmer-showing")
    popup.classList.add("popup-showing")
    popupScrollSection.scrollTop = 0;
    displayText(subjectObject.info[makeTabs[0]])
    document.querySelector(".image-screen").src = subjectObject.img;
    popupHeadImg.querySelector(".popup-image-text").innerHTML = subjectObject.title;
    birthdayField.innerHTML = subjectObject.birthday;
    parentsField.innerHTML = subjectObject.parents;

    if (subjectObject.buttonTitle == "Archive$6841"){
        let reviewSection = document.getElementById("review-bit")
        let reviewflex = document.getElementsByClassName(".review-area-flex-box")
        reviewSection.style.display = "none"
    } else {
        let reviewSection = document.getElementById("review-bit")
        let reviewflex = document.getElementsByClassName(".review-area-flex-box")
        reviewSection.style.display = "block"
    }

    //Sound effects
    
    let swooshSound = document.getElementById("sfxSwoosh");

    swooshSound.currentTime = 0; 
    swooshSound.play();


    //Makes all the tabs
    for (let j = 0; j < makeTabs.length; j ++){
        //Create the tab and the text node inside
        const createTab = document.createElement("div")
        const createTabName = document.createTextNode("(empty)")

        //Gives a class to the tab
        createTab.classList.add("popup-tab")

        //Sets id for the tab
        //createTab.id = "popupTab"

        //Attaches the text to the tab, and the tab to the tab bar
        createTab.appendChild(createTabName)
        popupTabs.appendChild(createTab)

        //Object with all the data for the button
        const objectData = subjectObject.info[makeTabs[j]]

        //Changes whats written on the tab to be correct
        createTab.innerHTML = /*makeTabs[j]*/objectData.header

        createTab.id = objectData.header
        
        //Changes the description and heading on click of the tab
        createTab.addEventListener("click", function(){ 
            displayText(objectData)
        })
        
    }          

    //Shows all the reviews if there are any
    if ("reviews" in subjectObject) {
        console.log("reviews found")

        //Creates all the reviews
        displayAllReviews(subjectObject)

        loadReviewStats(subjectObject)
        

        //alert(reviewsAverage)

    } else { //when there are no reviews
        console.log("no reviews found")
        if (subjectObject.buttonTitle == "Archive$6841"){
            reviewersText.innerHTML = "You can't leave reviews here."
        } else {
            reviewersText.innerHTML = "No reviewers. Be the first!"

        }
        
        reviewRatingAverage.innerHTML = "No reviews"
        reviewStarsAverage.innerHTML = "&#x2606&#x2606&#x2606&#x2606&#x2606"
    }


    checkPopupTabs()
}

//Closes the popup window
function closePopup() {
    currentDisplay = 0;

    //Hides the popup and dimmer
    dimmer.style.display = "none";
    popup.classList.remove("popup-showing")

    //dimmer.classList.remove("dimmer-showing")
    //popup.style.display = "none";
    


    //Deletes all the tabs for the popup
    let deleteTabs = document.querySelectorAll(".popup-tab")
    deleteTabs.forEach((el) => {
        el.remove()
    })

    //Deletes all the reviews for the popup
    let deleteReviews = document.querySelectorAll(".review-individual")
    deleteReviews.forEach((el) => {
        el.remove()
    })
}

//Changes the header and description within the popup
function displayText(subject) {
    popupBodyHeader.innerHTML = subject.header
    popupBodyDescription.innerHTML = subject.description

    checkPopupTabs()
    
}

//Looks through the tabs, changes their colour when their description is being displayed
function checkPopupTabs(){
    let popupTabsAll = document.querySelectorAll(".popup-tab")
    popupTabsAll.forEach((tab) => {
        if (popupBodyHeader.innerHTML === tab.id) {
            tab.classList.add("popup-tab-selected")
        }
        else{
            tab.classList.remove("popup-tab-selected")
        }
    })
}

//Creates a new scene element using sceneData
function displayNewScene(sceneData){
    //Contains the object with all data for currently targeted button 
    let displayData = displays[sceneData]  


    //Create the elements for the scene
    const createSceneSpace = document.createElement("div")
    const createFlexBox = document.createElement("div")
    const createImg = document.createElement("img")
    const createSceneTextEl = document.createElement("div")
    const createSceneTextNode = document.createTextNode("(No <br> title)")

    //Append the children so we can have it in the right layout
    createSceneSpace.appendChild(createFlexBox)
    createFlexBox.appendChild(createImg)
    createFlexBox.appendChild(createSceneTextEl)
    createSceneTextEl.appendChild(createSceneTextNode)

    //Add classes to everything
    createSceneSpace.classList.add("scene-space")
    createFlexBox.classList.add("scene-view-flex-box")
    createImg.classList.add("scene-view-img")
    createSceneTextEl.classList.add("scene-view-text")

    //Change the id of things
    createFlexBox.id = sceneData

    //Insert the image
    createImg.src = displayData.img

    //Change the text on the title of scene
    createSceneTextEl.innerHTML = displayData.buttonTitle

    //Add the whole scene to the main area
    mainArea.appendChild(createSceneSpace)
    //On scene click, opens the popup
    createFlexBox.addEventListener("click", function(){ 
        //alert(displayData, sceneData)
        openPopup(displayData, sceneData)
    })
}

//Creates every scene that exists in a random order
function displayAllScenes(){
    //Delete all currently displayed scenes
    while (mainArea.firstChild) {
        mainArea.removeChild(mainArea.firstChild)
    }

    //Resets the search bar content
    searchBar.value = ""

    //Finds all the displays in object display
    let displayKeys = Object.keys(displays)

    //Shuffles display
    shuffle(displayKeys)
    
    //Loops through the list and creates display
    for (let i = 0; i < displayKeys.length; i ++){
        displayNewScene(displayKeys[i])
    }

    //Grabs all the scenes
    let scenes = document.querySelectorAll(".scene-view-flex-box");
    let audio = document.getElementById("sfxHover");
    scenes.forEach(scene => {
        scene.addEventListener("mouseenter", () => {
            audio.currentTime = 0; // rewind so it can play again
            audio.play();
            console.log("a")
        });
    });
}

//Enter key for search bar
function enterSearchQuery(){
    //If searchbar value isnt none
    if (searchBar.value != "") {
        //Delete all currently displayed scenes
        while (mainArea.firstChild) {
            mainArea.removeChild(mainArea.firstChild)
        }

        //SET VARIABLES

        //Clears the results thing
        let results = []
        //Sets the var to the inputted value
        let inputValue = searchBar.value.toLowerCase()
        //All the items of the (displays) object
        let allDisplays = Object.keys(displays)

        //MAIN LOOP
        
        //Loops through all items in allDisplays
        for (let i=0; i < allDisplays.length; i ++){
            //Variables
            let targ = displays[allDisplays[i]]
            let value = "o"
            let array = targ.tags
            //Lower case of the title
            if (targ.title){
                let targTitleLower = targ.title.toLowerCase() 

                //If the currently targeted display matches the search function
                //Adds it to the list to be created
                if (targTitleLower === inputValue){
                    results.unshift(allDisplays[i])
                } else if (targTitleLower.includes(inputValue)){
                    results.unshift(allDisplays[i])
                }
                else if (targ.tags){
                    if (targ.tags.includes(inputValue)){
                        results.push(allDisplays[i])
                    }
                }
            }
            
        }
        //Creates display for each object on list
        for (let i = 0; i < results.length; i ++){
            displayNewScene(results[i])
        }
    }
    else {
        displayAllScenes()
    }
}

//Creates a review element in the review-section within popup
function displayReview(textData){
    //The space within popup for reviews
    let reviewSection = document.getElementById("review-section")

    //Create the elements for the scene
    const createReviewWhole = document.createElement("div")
    const createTopFlexBox = document.createElement("div")
    const createReviewStars = document.createElement("div")
    const createReviewName = document.createElement("div")
    const createReviewTextArea = document.createElement("div")

    //Create the text nodes for the elements
    const createStarsText = document.createTextNode("(No stars)")
    const createTitleText = document.createTextNode("(No Reviewer)")
    const createReviewText = document.createTextNode("(No Review)")

    //Append the children so we can have it in the right layout
    createReviewWhole.appendChild(createTopFlexBox)
    createReviewWhole.appendChild(createReviewTextArea)
    createTopFlexBox.appendChild(createReviewStars)
    createTopFlexBox.appendChild(createReviewName)

    //Add the text nodes to everything
    createReviewStars.appendChild(createStarsText)
    createReviewName.appendChild(createTitleText)
    createReviewTextArea.appendChild(createReviewText)

    //Add classes
    createReviewWhole.classList.add("review-individual")
    createTopFlexBox.classList.add("review-top-flex-box")
    createReviewStars.classList.add("review-stars")
    createReviewName.classList.add("review-name")
    createReviewTextArea.classList.add("review-text")

    //Change id's
    createReviewStars.id = "review-stars"

    
    //Change the text on the review
    createReviewName.innerHTML = textData.reviewer
    createReviewTextArea.innerHTML = textData.review

    if (createReviewTextArea.innerHTML == ""){
        createReviewTextArea.innerHTML = "-No review-"
    }

    //Turn stars (number) into text
    let stars = ""
    for (let j = 1; j <= 5; j ++){
        if (j <= textData.stars) {
            stars += "&#9733"
        } else {
            stars += "&#x2606"
        }
    }
    createReviewStars.innerHTML = stars

    //Add the whole scene to the main area
    if (reviewSection.hasChildNodes) {
        let child = reviewSection.firstChild
        reviewSection.insertBefore(createReviewWhole, child)
    } else {
        reviewSection.appendChild(createReviewWhole)
    }
}

//Destroys and then remakes all the reviews
function displayAllReviews(subjectObject) {
    
    //Deletes all the reviews for the popup
    let deleteReviews = document.querySelectorAll(".review-individual")
    deleteReviews.forEach((el) => {
        el.remove()
    })

    //Creates all the reviews for the popup
    let makeReviews = Object.keys(subjectObject.reviews)
    if (makeReviews.length < 1){
        reviewInputBox.placeholder = "Be the first one to review this topic"
    }
    else{
        
        reviewInputBox.placeholder = "Your thoughts on this topic"
    }
    for (let j = 0; j < makeReviews.length; j ++){
            
        //Object with all the data for the review
        const reviewData = subjectObject.reviews[makeReviews[j]]
        //Create the review
        displayReview(reviewData)
    }
}
//Submits the review using current text and star rating
function submitReview(stars) {
    let textClean = swearCheck([reviewInputBox.value])
    if (textClean){

        //Only submits if a star rating is given
        if (stars !== undefined) {
            let nextReviewKey;
            const d = new Date();
            const date = d.getDate() +"/"+ (d.getMonth()+1) +"/"+ d.getFullYear();
            
            if ("reviews" in currentDisplay){
                const reviewKeys = Object.keys(currentDisplay.reviews);
                const nextReview = reviewKeys.length + 1;
                nextReviewKey = `review${nextReview}`;
            } else {
                nextReviewKey = "review1"
            }

            //Adds the review to the object        
            setReview(currentDisplayKey, stars, reviewInputBox.value, date)

            if  (currentDisplay.reviews){
            } else{
                currentDisplay.reviews = {}
            }
                currentDisplay.reviews[nextReviewKey] = {
                    reviewer:date,//"You",
                    stars:stars,
                    review:reviewInputBox.value,
                }

            //Reset star rating and review
            stars = undefined;
            reviewInputBox.value = ""
            //Visually reset star rating
            starSelectors.forEach((a) => {
                a.innerHTML = "&#x2606"
            })

            //Reset the reviews to show your one
            displayReview(currentDisplay.reviews[nextReviewKey])
            //displayAllReviews(currentDisplay)
        }
    }
}

//Displays the reviews overall stats, like average stars and reviewers
function loadReviewStats(subjectObject) {
    console.log("Aaasdfa")
        //Displays the total reviews
        let allReviews = Object.keys(subjectObject.reviews)
        let reviewsNumber = allReviews.length
        let reviewSelectedStars;
        if (reviewsNumber > 1){
            reviewersText.innerHTML = `${reviewsNumber} total reviews`
        } else if (reviewsNumber === 0){
            if (subjectObject.buttonTitle == "Archive$6841"){
                reviewersText.innerHTML = "You can't leave reviews here."
            } else {
                reviewersText.innerHTML = "No reviewers. Be the first!"
            }
        } else if (reviewsNumber === 1) {
            reviewersText.innerHTML = `Only ${reviewsNumber} review so far`
        }

        //Gets the average review stars
        let reviewSelected = null
        let reviewsTotalStars = 0
        //Loops through each review, adds its stars to a total
        for (let i = 0; i < reviewsNumber; i += 1) {
            reviewSelectedStars = subjectObject.reviews[allReviews[i]].stars
            reviewsTotalStars += reviewSelectedStars
        }
        //Gets the average of the total
        let reviewsAverage = Math.round((reviewsTotalStars/reviewsNumber)*10)/10

        //Displays the average rating as a number
        if (reviewsNumber >= 1){
            console.log("B")
            reviewRatingAverage.innerHTML = `${reviewsAverage} <small>Stars overall</small>`
        } else {
            console.log("A")
            reviewRatingAverage.innerHTML = "No reviews"
        }
        
        let stars = ""
        for (let j = 1; j <= 5; j ++){
            if (j <= reviewsAverage) {
                stars += "&#9733"
            } else {
                stars += "&#x2606"
            }
        }

        if (reviewsNumber >= 1){
            reviewStarsAverage.innerHTML = stars
        } else if (reviewsNumber === 0){
            reviewStarsAverage.innerHTML = "&#x2606&#x2606&#x2606&#x2606&#x2606"
        } 
}


function showNotification(head, body, link=undefined, linkText=undefined){
    const notif = document.createElement("div")
    const notifHead = document.createElement("div")
    const TextElHead = document.createTextNode("Head")
    const notifBody = document.createElement("div")
    const TextElBody = document.createTextNode("Body")
    const notifHeadFlex = document.createElement("div")
    const notifClose = document.createElement("div")
    const notifCloseText = document.createTextNode("X")

    notif.appendChild(notifHeadFlex)
    notif.appendChild(notifBody)
    notifHeadFlex.appendChild(notifHead)
    notifHeadFlex.appendChild(notifClose)
    notifClose.appendChild(notifCloseText)
    notifHead.appendChild(TextElHead)
    notifBody.appendChild(TextElBody)

    notifHeadFlex.classList.add("general-flex")
    notifClose.classList.add("notification-close")
    notifHead.classList.add("notification-header")
    notifBody.classList.add("notification-body")
    notif.classList.add("notification-card")
    notifArea.appendChild(notif)

    notifHead.innerHTML = head
    notifBody.innerHTML = body

    if (link != undefined){
        var a = document.createElement('a');
        a.setAttribute('href', link);
        a.setAttribute('target', "_blank");
        a.innerHTML = linkText;
        
        var b = document.createElement('a');
        b.setAttribute('href', link);
        b.setAttribute('target', "_blank");
        b.innerHTML = "(link)";
        
        notifBody.appendChild(a)
        notifHead.appendChild(b)
    }


    notifClose.addEventListener("click", () => {
        //document.getElementById()
        notif.remove()
    });
}

function swearCheck(input){
    for (let j = 0; j < input.length; j ++) {
        let currentVal = input[j]
        for (let i = 0; i < bannedWords.length; i ++) {
            if ((typeof currentVal) == "string"){
                if (currentVal.toLowerCase().includes(bannedWords[i])) {
                    console.log("Bad words")
                    showNotification("Innapropriate word usage!", `You have attempted to submit text containing innapropriate words or phrases. Please only post content that is appropriate for all ages.<br><strong>Word used: ${bannedWords[i]}</strong>.`)
                    return false
                }
            }
        }
    }
    return true
}


//Sets up the page on entry
readDatabase("displays").then(data => {
    if (data){
        displays = data
    }
})






export { displays, swearCheck, showNotification, shuffle, openPopup, closePopup, displayText, checkPopupTabs, displayNewScene, displayAllScenes, enterSearchQuery, displayReview, displayAllReviews, submitReview }