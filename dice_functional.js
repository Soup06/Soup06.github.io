//--Define elements
const rollButton = document.getElementById("rollButton");
let dice = document.querySelectorAll(".dice-image");
const diceAdders = document.querySelectorAll(".dice-adder");
const rollTotalDisplay = document.getElementById("totalRoll");
const maxRollDisplay = document.getElementById("maxRollDisplay");
const minRollDisplay = document.getElementById("minRollDisplay");



const one = "images/d6/one.png"
const two = "images/d6/two.png"
const three = "images/d6/three.png"
const four = "images/d6/four.png"
const five = "images/d6/five.png"
const six = "images/d6/six.png"

let dicePile = {
    d4:{
        sides:4,
        one:"images/d4/one.png",
        two:"images/d4/two.png",
        three:"images/d4/three.png",
        four:"images/d4/four.png",
        faces:["images/d4/one.png", "images/d4/two.png", "images/d4/three.png", "images/d4/four.png"]
    },
    d6:{
        sides:6,
        one:"images/d6/one.png",
        two:"images/d6/two.png",
        three:"images/d6/three.png",
        four:"images/d6/four.png",
        five:"images/d6/five.png",
        six:"images/d6/six.png",
        faces:["images/d6/one.png", "images/d6/two.png", "images/d6/three.png", "images/d6/four.png", "images/d6/five.png", "images/d6/six.png"]
    },
    d8:{
        sides:8,
        one:"images/d8/one.png",
        two:"images/d8/two.png",
        three:"images/d8/three.png",
        four:"images/d8/four.png",
        five:"images/d8/five.png",
        six:"images/d8/six.png",
        seven:"images/d8/seven.png",
        eight:"images/d8/eight.png",
        faces:["images/d8/one.png", "images/d8/two.png", "images/d8/three.png", "images/d8/four.png", "images/d8/five.png", "images/d8/six.png", "images/d8/seven.png", "images/d8/eight.png"]
    },
}

//let faces = [one, two, three, four, five, six]

//>>-Functions

//--Puts a random number on each dice
function rollDice(dice) {
    let diceData = dicePile[dice.id]

    let number = Math.floor(Math.random() * diceData.sides)

    dice.classList.remove("rolling-start")
    dice.classList.remove("rolling-end")

    dice.classList.add("rolling-start") //Begins the animation
    dice.addEventListener('animationend', () =>{ //On the end of starting animation, start the ending animation and switch to different face
        dice.src = diceData.faces[number] //Switch face to correct number
        
        dice.classList.remove("rolling-start") //Switch over animations
        dice.classList.add("rolling-end")
        dice.addEventListener('animationend', () => {
            dice.classList.remove("rolling-end")
            findTotal()
        })
    });
    return false
    
};

function rollAllDice() {
    dice.forEach((a) => {
        rollDice(a)
    });
};

//--Finds the total value of all dice
function findTotal() {
    //Defines the total score
    let total = 0

    dice.forEach((a) => {
        let diceData = dicePile[a.id]

        //Loops through each possible dice face
        for (let i = 0; i < diceData.faces.length; i ++) {
            //When the current dice face is the one its checking, adds the number to the score
            if (a.getAttribute("src") == diceData.faces[i]) {
                total += (i+1)
                i = diceData.faces.length
            };
        };
    });

    rollTotalDisplay.innerHTML = total

    console.log(total)
    return total
};

//--Adds another dice to the lot
function addDice(name) {
    if (dice.length < 10) {
        let diceData = dicePile[name]

        const mainArea = document.getElementById("mainBody")
        const newDice = document.createElement("img")
        
        newDice.src = diceData.faces[diceData.faces.length-1] //Sets the dice to be facing one
        newDice.classList.add("dice-image")//Gives the new dice a class
        console.log(name)
        newDice.id = name //Gives the dice id=dice sides
        mainArea.appendChild(newDice) //Adds dice to main area

        //Ensures that new dice is recognised as a dice
        dice = document.querySelectorAll(".dice-image");

        //Recalculates the total and adds event listeners to each dice
        findTotal()
        addDiceClickFunction()
    }

    calcMaxTotal()
    calcMinTotal()
};

//--Gives each dice its onclick functions
function addDiceClickFunction(){
    dice.forEach((a) => {
        a.addEventListener('click', () => {
            deleteDice(a)
        });
    });
};

//--Calculates the max total number for roll
function calcMaxTotal(){
    let total = 0
    dice.forEach((a) => {
        let diceData = dicePile[a.id]
        total += diceData.sides
    })

    maxRollDisplay.innerHTML = `Max possible: ${total}`
}

//--Calculates the min total number for roll
function calcMinTotal(){
    let total = 0
    dice.forEach((a) => {
        let diceData = dicePile[a.id]
        total += 1
    })

    minRollDisplay.innerHTML = `Min possible: ${total}`
}

function deleteDice(el) {
    el.remove()
    //Ensures that new dice is recognised as a dice
    dice = document.querySelectorAll(".dice-image");

    //Recalculates the total
    findTotal()
}




//>>-Event listeners

rollButton.addEventListener('click', () =>{
    rollAllDice()
    //let totalRoll = findTotal()
    
});

diceAdders.forEach((a) => {
    a.addEventListener('click', () => {
        let diceName = `d${a.id}`
        console.log(diceName)
        addDice(diceName)
    })
})



//>>-Setup
addDice("d6")
addDiceClickFunction()
