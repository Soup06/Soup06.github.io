import { writeDatabase, readDatabase } from './dataBase.js';


//Find elements
let popup = document.getElementById("popup");
let popupBody = document.getElementById("popup-body"); 
let popupBodyHeader = document.getElementById("popup-body-header");
let popupBodyDescription = document.querySelector(".popup-body-description");
let btn = document.getElementsByClassName("scene-view-flex-box");
let dimmer = document.getElementById("dimmer");
let closeBtn = document.getElementById("close-popup");
let popupHeadImg = document.getElementById("image-display");
let popupTabs = document.getElementById("tab-bar");
let popupTabsAll = document.querySelectorAll(".popup-tab");
let searchButton = document.getElementById("submitButton");
let searchBar = document.getElementById("searchField");
let birthdayField = document.getElementById("popup-birthday");
let parentsField = document.getElementById("popup-parents");
let closePopupButton = document.getElementById("close-popup");
let mainArea = document.querySelector(".section-layer");
let starSelectors = document.querySelectorAll(".star-selector");
let reviewSubmitButton = document.getElementById("review-submit");
let reviewInputBox = document.getElementById("review-input");

//Used for reviews
let starRating = undefined;
//Current data used for display
let currentDisplay = 0;

let displays = {}




//________________________________________________________

//Functions


//Opens the popup window
function openPopup(subjectObject) {

    //Resets the review text
    reviewInputBox.value = ""
    starRating = undefined
    starSelectors.forEach((a) => {
        a.innerHTML = "&#x2606"
    })

    let makeTabs = Object.keys(subjectObject.info)
    currentDisplay = subjectObject

    dimmer.style.display = "block";
    //dimmer.classList.add("dimmer-showing")
    popup.classList.add("popup-showing")
    popup.scrollTop = 0;
    displayText(subjectObject.info[makeTabs[0]])
    document.querySelector(".image-screen").src = subjectObject.img;
    popupHeadImg.querySelector(".popup-image-text").innerHTML = subjectObject.title;
    birthdayField.innerHTML = subjectObject.birthday;
    parentsField.innerHTML = subjectObject.parents;

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
    
    displayAllReviews(subjectObject)
    
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
        openPopup(displayData)
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
        for (i=0; i < allDisplays.length; i ++){
            //Variables
            let targ = displays[allDisplays[i]]
            let value = "o"
            let array = targ.tags
            //Lower case of the title
            let targTitleLower = targ.title.toLowerCase() 

            //If the currently targeted display matches the search function
            //Adds it to the list to be created
            if (targTitleLower === inputValue){
                results.unshift(allDisplays[i])
            } else if (targTitleLower.includes(inputValue)){
                results.unshift(allDisplays[i])
            }
            else if (targ.tags.includes(inputValue)){
                results.push(allDisplays[i])
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
    reviewSection.appendChild(createReviewWhole)
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
function submitReview() {
    //Only submits if a star rating is given
    if (starRating !== undefined) {
        const reviewKeys = Object.keys(currentDisplay.reviews);
        const nextReview = reviewKeys.length + 1;
        const nextReviewKey = `review${nextReview}`;

        //Adds the review to the object
        currentDisplay.reviews[nextReviewKey] = {
            reviewer:"You",
            stars:starRating,
            review:reviewInputBox.value,
        }

        //Reset star rating and review
        starRating = undefined;
        reviewInputBox.value = ""
        //Visually reset star rating
        starSelectors.forEach((a) => {
            a.innerHTML = "&#x2606"
        })

        //Reset the reviews to show your one
        displayAllReviews(currentDisplay)
    }
    
}

//Shuffles an array (copied from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
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
}


//________________________________________________________

//Objects

//BBX, Taco wednesdays, Joustus, Dr pepper guy

//Object containing text in all the displays


/*
const displaysBuiltin= {
    display1:{
        buttonTitle:"Earth",
        title:"Earth",
        img:"images/earth.jpeg",
        birthday:"Unknown",
        parents:"God",
        info: {
            info1: {
                header: "Life on Earth",
                description: "Earth is the only known planet to support life, hosting an extraordinary diversity of organisms ranging from microscopic bacteria to complex multicellular species, all shaped by billions of years of evolution in dynamic ecosystems."
            },
            info2: {
                header: "Natural Resources",
                description: "From freshwater and fertile soil to fossil fuels and precious metals, Earth’s resources have sustained civilizations for millennia, though overuse and pollution now pose serious threats to long-term sustainability."
            },
            info3: {
                header: "Fun Facts",
                description: "Earth has a molten iron core that generates its magnetic field, spins at roughly 1,600 km/h at the equator, and experiences constant tectonic motion that reshapes its continents over geologic time."
            }
        },
        reviews: {
            review1: {
                reviewer: "Person",
                stars:5,
                review: "This is a really nice planet love it"
            },
        },
        tags: ["planet","space","life","environment","biosphere","resources","solar system","science","nature","astronomy"]
    },
    display2:{
        buttonTitle:"Future Redeemed",
        title:"Future Redeemed",
        img:"images/future_redeemed.jpeg",
        birthday:"26 April 2023",
        parents: "Monolith Soft / Tetsuya Takahashi",
        info: {
            info1: {
                header:"Overview",
                description:"Future Redeemed is a <b>DLC</b> game branching from <b>Xenoblade Chronicles 3</b> (Switch). It is the <b>finale</b> to the Klaus Saga, comprising of the 3 numbered <b>Xenoblade</b> games. Future Redeemed revolves around <b>exploration, story,</b> and tactical, real-time <b>combat</b>",
            },
            info2: {
                header: "Carachters",
                description: "The cast of Future Redeemed merges carachters from across the previous games. <br><br><b>Matthew Vandham</b> (N's Great grandson)<br>     DPS/Balanced attacker: Constantly cancels attacks into eachother. Mildly broken, but quite fun to play as. <br><br><b>A</b> (Derived from Alvis/Ontos )<br>     Healer: Tried to heal the party while also dealing damage. Didn't succeed at either. <br><br><b>Shulk</b> (XC1)<br>     Evasion tank: Designed to hold aggro and evade attacks. Does poorly at both. <br><br><b>Nikol</b> (Shulk and Fiora's Child)<br>     Face tank/Brick wall: Designed to hold aggro and survive attacks with high health and defence. Unkillable but also doesnt gain aggro. <br><br><b>Glimmer</b> (Rex and Pyra's Child)<br>     Support/Buffer: Keeps the party high on health and damage buffs. <br><br><b>Rex the Gigachad</b> (XC2)<br>     DPS/Glass Cannon: Potentially the most broken party member of the saga. Constant crits, can cancel arts into themselves to do massive damage."
            },
            info3: {
                header: "Gameplay & Themes",
                description: "Blending real-time combat, character bonds, and expansive exploration, it dives deep into the nature of memory, choice, and identity while offering refined mechanics and quality-of-life improvements over the base game."
            },
            info4: {
                header: "Series Connection",
                description: "As the final game in the Klaus saga, Future Redeemed ties together all of the lore between the games, and provides a sweet end to the plot. It has many throwbacks and references to previous games, and has a cast of carachters from all across the series."
            }
        },
        reviews: {
            review1: {
                reviewer: "Person",
                stars:5,
                review: "Actual peak game"
            },
        },
        tags: ["game","JRPG","Xenoblade","Nintendo","story","combat","sci-fi","fantasy","Switch","Takahashi"]
    },
    display3:{
        buttonTitle:"Hollow Knight",
        title:"Hollow Knight",
        img:"images/hollow_knight.jpeg",
        birthday:"27 February 2017",
        parents:"Team Cherry",
        info: {
            info1: {
                header: "Overview",
                description: "Hollow Knight is a 2D action-adventure game set in the ruined bug kingdom of Hallownest, featuring stunning hand-drawn art, challenging combat, and an intricately interconnected world steeped in mystery and melancholy."
            },
            info2: {
                header: "Gameplay",
                description: "Combining tight platforming, Metroidvania-style exploration, and brutal boss fights, it encourages player mastery and curiosity, offering meaningful rewards for those who venture off the beaten path."
            },
            info3: {
                header: "Cultural Impact",
                description: "With universal acclaim for its atmosphere, music, and depth, it redefined what indie games could achieve and built a passionate community eagerly awaiting its long-teased sequel, <b>Silksong</b>."
            }
        },
        reviews: {
        },
        tags: ["game","indie","Metroidvania","2D","combat","bugs","exploration","Silksong","platformer","aesthetic"]
    },
    display4:{
        buttonTitle:"Trees",
        title:"Trees",
        header:"Description",
        img:"images/tree.jpeg", 
        birthday:"Unknown",
        parents:"Unknown",
        info: {
            info1: {
                header: "Role in Nature",
                description: "Trees are ecological pillars that produce oxygen through photosynthesis, stabilize soil, regulate climate, support entire food chains, and serve as homes for countless species, from birds to fungi to humans."
            },
            info2: {
                header: "Types of Trees",
                description: "With over 60,000 known species ranging from towering sequoias to delicate bonsai, trees exhibit a huge variety of shapes, lifespans, and growth strategies, thriving in environments from arctic tundra to tropical rainforest."
            },
            info3: {
                header: "Human Use",
                description: "Trees have been central to human life for thousands of years, providing materials like wood, fruit, medicine, and shelter, while also featuring prominently in myths, art, spirituality, and modern climate solutions."
            }
        },
        reviews: {
        },
        tags: ["nature","plant","trees","environment","biology","oxygen","forest","photosynthesis","habitat","climate"]
        
    },
    display5:{
        buttonTitle: "Fiordland",
        title: "Fiordland National Park",
        img: "images/fiordland.jpeg",
        birthday: "1952",
        parents: "New Zealand Department of Conservation",
        info: {
            info1: {
            header: "Location",
            description: "Located in the southwest of New Zealand's South Island, Fiordland is a UNESCO World Heritage Site filled with glaciers, waterfalls, rainforests, and deep fjords including Milford Sound."
            },
            info2: {
            header: "Unique Features",
            description: "It’s home to rare wildlife like the takahē and kea, dramatic peaks that plunge into ocean inlets, and lush moss‑coated forests that make it feel almost prehistoric."
            },
            info3: {
            header: "Visitor Experience",
            description: "Tourists can explore by boat, helicopter, or hiking the Kepler, Routeburn, or Milford Tracks—some of the world’s most scenic trails through untouched wilderness."
            }
        },
        reviews: {
        },
        tags: ["place","New Zealand","national park","UNESCO","nature","hiking","fjords","wildlife","adventure","ecotourism","landscape"]
    },
}*/


//________________________________________________________

//Elements

//Creates a new scene with the id of (buttonId)
/*function displayNewScene(buttonId){

    //Get the main area for creating scenes
    let mainArea = document.querySelector(".section-layer")

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
    createFlexBox.id = buttonId

    //Add the whole scene to the main area
    mainArea.appendChild(createSceneSpace)
}*/




//________________________________________________________


//Creates all the displays


//Same as full code, but using the function

//Creates every display that exists


//Full code
/*
displayKeys = Object.keys(displays)
for (let i = 0; i < displayKeys.length; i ++){

    //Contains the object with all data for currently targeted button 
    let displayData = displays[displayKeys[i]]  

    //Get the main area for creating scenes
    let mainArea = document.querySelector(".section-layer")

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
    createFlexBox.id = displayKeys[i]

    //Insert the image
    createImg.src = displayData.img

    //Change the text on the title of scene
    createSceneTextEl.innerHTML = displayData.buttonTitle

    //Add the whole scene to the main area
    mainArea.appendChild(createSceneSpace)
    
    //On scene click, opens the popup
    createFlexBox.addEventListener("click", function(){ 
        openPopup(displayData)
    })
}*/

//Event listeners

//Search function
searchButton.addEventListener('click', () => {
    enterSearchQuery()
})
    
//All keyboard inputs
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
        if (document.activeElement == searchBar) {
            enterSearchQuery()
        }
    }
    if (event.keyCode == 27) {
        if (popup.classList.contains("popup-showing")) {
            closePopup()
        }
    }
});

//Closes the popup
closePopupButton.addEventListener('click', () => {
    closePopup()
})

//Submit button on reviews
reviewSubmitButton.addEventListener('click', () => {
    submitReview()
})

dimmer.addEventListener('click', () => {
    closePopup()
})


//Lets you select star rating on reviews
starSelectors.forEach((select, index) => {
    select.addEventListener("click", () => {
        starSelectors.forEach((a, b) => {
            if (b <= index){
                a.innerHTML = "&#9733"
            } else {
                a.innerHTML = "&#x2606"
            }
        })
        starRating = index+1
    });
});

let openExplaination={
    buttonTitle: "Fiordland",
    title: "Archive of <br> Aleatoria",
    img: "images/earth.jpeg",
    birthday: "12 June 2023",
    parents: "Soup06",
    info: {
        info1: {
        header: "Welcome",
        description: "This is the Archive of <strong>Aleatoria</strong>. <br> Here you can discover new hobbies, entertainment, locations, and anything else."
        },
        info2: {
        header: "Discover",
        description: "Our whole database is displayed randomly, so just keep scrolling to find more interesting topics. If you have something in mind, hit the search bar at the top of the screen."
        },
        info3: {
        header: "Posting",
        description: "In the Archive of <strong>Aleatoria</strong>, you can also share your own interests. <br>Click the <strong>'create'</strong> button at the <strong>top</strong> of the screen, pick a topic, and get writing. The idea is that you can share your <strong>niche</strong> or not so well-known interests with the world. <br>Feel free to talk about <strong>hobbies, entertainment, locations</strong>, anything you want"
        },
        
    },
    reviews: {
    },
    tags: ["place","New Zealand","national park","UNESCO","nature","hiking","fjords","wildlife","adventure","ecotourism","landscape"]
}

//writeDatabase("displays", displays)


//Sets up the page on entry
readDatabase("displays").then(data => {
    if (data){
        displays = data
        displayAllScenes()
    }
})

openPopup(openExplaination)
