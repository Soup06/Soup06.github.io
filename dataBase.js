// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child, push, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getStorage, ref as imageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkc4wDWJfRd6692i_4_abor-oyWIQNe3A",
    authDomain: "archive-35fc6.firebaseapp.com",
    projectId: "archive-35fc6",
    storageBucket: "archive-35fc6.firebasestorage.app",
    messagingSenderId: "550802149160",
    appId: "1:550802149160:web:d949daf390c353a80b4a1d",
    measurementId: "G-7GHQ5H5E7E",
    databaseURL: "https://archive-35fc6-default-rtdb.firebaseio.com/" // needed for Realtime DB
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);


// Write to database

//Writes a value to the database
function writeDatabase(location, input){
    set(ref(db, location), input)
    .then(() => {
        console.log("Data saved successfully!");
    })
    .catch((error) => {
        console.error("Error saving data:", error);
    });
}

//Obtains a value from the database
async function readDatabase(location){
    const item = await get(child(ref(db), location))
    if (item.exists()) {
        const thing = item.val()
        console.log("Data from DB:", thing);
        return thing
        
    } else {
        console.log("No data found.");
        return null
    }
}

function setReview(location, starNumber, reviewText){
    const reviewsRef = ref(db, /*"displays/display1*/`displays/${location}/reviews`)
    const newReview = push(reviewsRef)
    
    set(newReview, {
        reviewer:"You",
        stars:starNumber,
        review:reviewText,
    })
    .then(() => console.log("Review logged"))
}

function createScene(value){
    const reviewsRef = ref(db, "displays")
    const newReview = push(reviewsRef)
    
    set(newReview, value)
    .then(() => console.log("Review logged"))
}

function storeImage(file){
    const storage=getStorage();
    const storagePlace = imageRef(storage, 'displays/' + file.name);

    return uploadBytes(storagePlace, file)
    .then(item => {
        return getDownloadURL(item.ref);
    }).then(url => {
        console.log("Image URL:", url);
        return url;
    })
}


let stuff = {
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
        reviews: {
        },
        info: {
            info1: {
            header: "Location",
            description: "Located within the southwest of New Zealand's South Island, Fiordland is a UNESCO World Heritage Site filled with glaciers, waterfalls, rainforests, and deep fjords including Milford Sound."
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
        
        tags: ["place","New Zealand","national park","UNESCO","nature","hiking","fjords","wildlife","adventure","ecotourism","landscape"]
    },
}

//writeDatabase("displays", stuff)
/*update(ref(db, "displays/display5"), {
    reviews: {
        review1: {
            reviewer: "New Person",
            stars: 5,
            review: "Nice!"
        }
    }
});*/
//createScene(displayNew)

/*readDatabase("displays/display1/info/info1/header").then(data => {
    alert(data)
})*/


//writeDatabase("entries/display00", "Holla")


export {writeDatabase, readDatabase, setReview, createScene, storeImage}