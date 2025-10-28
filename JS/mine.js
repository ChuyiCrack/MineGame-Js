const sizeSelector = document.getElementById("size")
const inputMines = document.getElementById("countMines")
const startGameButton = document.getElementById("startGame")
const cashOutBtn = document.getElementById("cashOut")
const displayBalance = document.getElementById("balance")
const inputBet = document.getElementById("bet")
const displayMultiplier = document.getElementById("multiplier")
const moneyMultiplied = document.getElementById("moneyMultiplied")
const allIn = document.getElementById("allIn")

const startingMoney = 50

let placedMines
let pressedCells

let gameStarted = false

let balance 
let prevMultiplier

// function factorial(curr){
//     if(curr == 1 || curr == 0){
//         return 1
//     }
//     return factorial(curr-1) * curr
// }


function showError(message) {
    const errorBox = document.getElementById('errorBox');
    errorBox.textContent = message;
    errorBox.style.display = 'block';
}

function restartAll(){
    changeSizeGrid()
    prevMultiplier = NaN
    placedMines = new Set([])
    pressedCells = new Set([])
    displayMultiplier.innerText = "1x"
    moneyMultiplied.innerText =  "$" + inputBet.value
}

function showAllMines(){
    for (const mine of placedMines) {
        document.getElementById(mine).classList.add('mine-box')
    }
}

function calculateMultiplierPorcentage(leftCells, safeCells){
    let currAcumulation = (leftCells / safeCells)
    if (!prevMultiplier){
        return currAcumulation
    }
    prevMultiplier = currAcumulation
    return prevMultiplier * currAcumulation
}

function shuffle(array) {   1
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];   // swap elements
  }
  return array;
}

function AppearMenu(){
    displayBalance.innerText = "$" + balance
    inputMines.value = placedMines.size
    document.getElementById("topButtons").style.display = "inline"
    document.getElementById("cashOut").style.display = "none"

}

function minePressed(cellPressed){
    let numBombs = inputMines.value
    let size = sizeSelector.value
    if(!gameStarted ||pressedCells.has(cellPressed)){
        return
    }

    if(placedMines.has(parseInt(cellPressed))){
        document.getElementById(cellPressed).style.backgroundColor = "red"
        gameStarted = false
        document.getElementById("labelWinLoose").innerText = "Busted"
        AppearMenu()
        showAllMines()
        return
    }
    document.getElementById(cellPressed).classList.add('safe-box')
    pressedCells.add(cellPressed)
    let totalSize = (size*size)
    let multiplier = calculateMultiplierPorcentage(totalSize , (totalSize - pressedCells.size - placedMines.size) + 1)
    displayMultiplier.innerText = (multiplier).toFixed(2) + "x"
    moneyMultiplied.innerText =  "$"+(multiplier*inputBet.value).toFixed(2)
    if(pressedCells.size == (size*size)-1){
        AppearMenu()
        document.getElementById("labelWinLoose").innerText = "You Won"
        balance+= (moneyMultiplied.innerText).split("$")[1]
        setBalanceCookie(balance)
        gameStarted = false
    }
}


function changeSizeGrid(){
    let size = sizeSelector.value
    console.log("changedGrid")
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
        gameStarted = false
        let earnedMoney = (moneyMultiplied.innerText).split("$")[1]
        console.log(earnedMoney)
        balance+= parseFloat(earnedMoney)
        setBalanceCookie(balance)
        showAllMines()
        document.getElementById("labelWinLoose").innerText = "You Won $" + earnedMoney
        AppearMenu()
}


function startGame(){
    const sizeGrid = sizeSelector.value
    const amountMines = inputMines.value
    const amountStaked = inputBet.value
    
    if(amountStaked > balance){
        showError("Not enough balance")
        return 
    }
    if( amountMines <= 0 || amountMines > (sizeGrid*sizeGrid)-1 || amountStaked < 0){
        showError("Some error in the inputs")
        return
    }
    document.getElementById("errorBox").style.display = "none"
    restartAll()
    balance-= amountStaked
    setBalanceCookie(balance)
    displayBalance.innerText = "$" + balance
    document.getElementById("labelWinLoose").innerText = ""
    

    gameStarted = true
    document.getElementById("cashOut").style.display = "inline"
    //Add event listener for each mine
    document.querySelectorAll('.boxMine').forEach(div => {
    div.addEventListener('click', (event) => {
        const id = event.target.id; // get the id of the clicked div
        minePressed(id);
    });
    });
    const allRows = shuffle(Array.from({ length: (sizeGrid*sizeGrid)}, (_, i) => i))

    for(let i = 0;i < amountMines ; i++){
        placedMines.add(allRows.pop())
    }

    document.getElementById("topButtons").style.display = "none"
}

function putAllMoney(){
    inputBet.value = balance
}


// Save balance in cookies (expires in 7 days)
function setBalanceCookie(Newbalance) {
    const days = 7;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = "balance=" + Newbalance + ";" + expires + ";path=/";
    balance = Newbalance
}

// Read balance from cookies
function getBalanceCookie() {
    const name = "balance=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return parseFloat(c.substring(name.length, c.length));
        }
    }
    return null; // No cookie found
}

// Function to delete balance cookie
function deleteBalanceCookie() {
    document.cookie = "balance=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


changeSizeGrid()
displayBalance.innerText = "$"+balance
sizeSelector.addEventListener("change" , changeSizeGrid)
startGameButton.addEventListener("click",startGame)
cashOutBtn.addEventListener("click" , cashOut)
allIn.addEventListener("click" , putAllMoney)


document.addEventListener("DOMContentLoaded", () => {
    const savedBalance = getBalanceCookie();
    const balanceElement = document.getElementById("balance");

    if (savedBalance !== null) {
        balanceElement.textContent = "$" + savedBalance.toFixed(2);
        balance = savedBalance
    } else {
        balanceElement.textContent = startingMoney; // default starting balance
        setBalanceCookie(startingMoney);
    }
});



// Handle reset button click
document.getElementById("resetBalance").addEventListener("click", () => {
    const confirmReset = confirm("Are you sure you want to reset your balance?");
    if (confirmReset) {
        setBalanceCookie(startingMoney);
        document.getElementById("balance").textContent = defaultBalance.toFixed(2);
        alert("Balance has been reset!");
    }
});


let porcentage = calculateMultiplierPorcentage(5,1,23)

