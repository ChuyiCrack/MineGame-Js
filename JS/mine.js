const sizeSelector = document.getElementById("size")
const inputMines = document.getElementById("countMines")
const startGameButton = document.getElementById("startGame")
const cashOutBtn = document.getElementById("cashOut")
const displayBalance = document.getElementById("balance")
const inputBet = document.getElementById("bet")

let placedMines
let pressedMines

let gameStarted = false

let balance = 5

function factorial(curr){
    if(curr == 1 || curr == 0){
        return 1
    }
    return factorial(curr-1) * curr
}


function calculateMultiplierPorcentage(size , mines , clicks){
    let totalCells = size*size
    let upperFraction = (factorial(totalCells-mines) - factorial(totalCells -clicks))
    let lowerFraction = (factorial(totalCells-mines-clicks) - factorial(totalCells))
    return upperFraction / lowerFraction
}

function shuffle(array) {   1
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];   // swap elements
  }
  return array;
}

function AppearMenu(){
    document.getElementById("topButtons").style.display = "inline"
    document.getElementById("cashOut").style.display = "none"

}

function minePressed(cellPressed){
    size = inputMines.value
    if(!gameStarted ||pressedMines.has(cellPressed)){
        return
    }
    if(pressedMines.length == (size*size)-1){
        return
    }
    
        console.log(placedMines)
    if(placedMines.has(parseInt(cellPressed))){
        document.getElementById(cellPressed).style.backgroundColor = "red"
        gameStarted = false
        AppearMenu()
        return
    }
    pressedMines.add(cellPressed)
    document.getElementById(cellPressed).style.backgroundColor = "green"

}


function changeSizeGrid(){
    let size = sizeSelector.value
    
    inputMines.value = 1
    inputMines.max = (size*size) - 1
    document.getElementById("mainDiv").innerHTML = ""
    let countMines = 0
    for(let i = 0; i < size; i++){
        const newRow = document.createElement("div");
       
        newRow.className = "boxRow"
        for(let k = 0; k < size; k++){
            const newMine = document.createElement("div");
            newMine.className = "boxMine"
            newMine.id = countMines
            newRow.appendChild(newMine)
            countMines+=1
        }
        document.getElementById("mainDiv").appendChild(newRow)
    }
}

function cashOut(){

}


function startGame(){
    const sizeGrid = sizeSelector.value
    const amountMines = inputMines.value
    const amountStaked = inputBet.value

    if( amountMines < 0 || amountStaked > balance || amountMines > (sizeGrid*sizeGrid)-1){
        return
    }
    balance-= amountStaked
    displayBalance.innerText = balance
    
    changeSizeGrid()
    placedMines = new Set([])
    pressedMines = new Set([])

    gameStarted = true
    document.getElementById("cashOut").style.display = "inline"
    //Add event listener for each mine
    document.querySelectorAll('.boxMine').forEach(div => {
    div.addEventListener('click', (event) => {
        
        const id = event.target.id; // get the id of the clicked div
        console.log(id)
        minePressed(id);
    });
    });
    const allRows = shuffle(Array.from({ length: (sizeGrid*sizeGrid)}, (_, i) => i))

    for(let i = 0;i < amountMines ; i++){
        placedMines.add(allRows.pop())
    }

    console.log(placedMines)
    document.getElementById("topButtons").style.display = "none"
}


changeSizeGrid()
displayBalance.innerText = balance
sizeSelector.addEventListener("change" , changeSizeGrid)
startGameButton.addEventListener("click",startGame)


