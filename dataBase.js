// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
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
/*function writeDatabase(input){
    set(ref(db, "entries/display"), input)
        .then(() => {
        console.log("Data saved successfully!");
        })
        .catch((error) => {
        console.error("Error saving data:", error);
        });
    }*/

// Read from database
/*function readDatabase(input){
    get(child(ref(db), input))
        .then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Data from DB:", snapshot.val());
        } else {
            console.log("No data found.");
        }
        })
        .catch((error) => {
        console.error(error);
    });
}*/

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
    /*get(child(ref(db), location))
        .then((snapshot) => {
        if (snapshot.exists()) {
            const thing = snapshot.val()
            console.log("Data from DB:", thing);
            alert(thing)
        } else {
            console.log("No data found.");
        }
        })
        .catch((error) => {
        console.error(error);
    });*/
    const snapshot = await get(child(ref(db), location))
    if (snapshot.exists()) {
        const thing = snapshot.val()
        console.log("Data from DB:", thing);
        return thing
        
    } else {
        console.log("No data found.");
        return null
    }
}
/*readDatabase("displays/display1/info/info1/header").then(data => {
    alert(data)
})*/


//writeDatabase("entries/display00", "Holla")


export {writeDatabase, readDatabase}