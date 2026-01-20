const bpmDisplay = document.getElementById("bpm_display")
const input = document.getElementById("bpm_input")
const changeIntervalButton = document.getElementById("change_interval_button")
const beatWrapper = document.getElementById("beat_wrapper")


const totalMs = 1000*60
var interval = totalMs/60
var currentTimeout = undefined
var beats = 4
var currentBeat = 1

//-- Metronome loop
function waitTime(){
    currentBeat += 1
    if (currentBeat > beats){
        currentBeat = 1
    }
    let audio = document.getElementById("sfxTick");
    audio.currentTime = 0
    audio.play()

    showBeats()

    currentTimeout = setTimeout(() => {
        waitTime()
    }, interval)
}

function showBeats(){
    bpmDisplay.innerHTML = `${(1/interval)*totalMs} BPM`

    for (const child of beatWrapper.children) {
        let beatNumber = parseInt(child.id, 10)
        if (beatNumber <= currentBeat) {
            child.classList.add("beat_crossed")
        } else {
            child.classList.remove("beat_crossed")
        }
        if (beatNumber == currentBeat){
            child.classList.add("beat_selected")
        } else{
            child.classList.remove("beat_selected")
        }
    }
}

//-- Sets a new interval and restarts metronome
function changeInterval(){
    //Updates the interval based on the text field
    interval = totalMs/input.value

    //Restarts the timeout 
    clearTimeout(currentTimeout)
    currentTimeout = setTimeout(() => {
        waitTime()
    }, interval)

    showBeats()

}

//-- Creates the vertical bars that represent each beat
function createBeatDisplays(number){
    for (let i = 0; i < number; i ++){
        const newEl = document.createElement("div")
        newEl.classList.add("beat")
        newEl.id = i+1
        beatWrapper.appendChild(newEl)
    }

}

//-- When clicking button, sets a new interval and restarts the metronome
changeIntervalButton.addEventListener("click", changeInterval)

createBeatDisplays(beats)

showBeats()

//-- Starts the metronome
setTimeout(() => {
    waitTime()
}, interval)