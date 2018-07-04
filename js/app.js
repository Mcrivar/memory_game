//game timer
const timer = document.getElementById('timer');
let seconds = 0;
let minutes = 0;
let time;
let timerStart;

//cards set
const cards = document.getElementsByClassName("card");
let shuffledCards = [...cards];


//moves and stars
const stars = document.querySelectorAll(".fa-star");
const starsList = document.querySelector(".stars");

let movesCounter = document.querySelector(".moves");
let moves = 0;

let scores = 3;

//cards after move is done
let matchedCards = 0;
const openCards = document.getElementsByClassName("open");


//visible cards
const deck = document.querySelector(".deck");


//start game after window is loaded or refreshed
window.addEventListener("load", function(){
    initGame();
});


//game restart
document.querySelector(".restart").addEventListener("click", () => {
    initGame();
});

checkCards();

//game initialisation
function initGame(){

    //clear all moves
    moves = 0;
    movesCounter.innerHTML = "0";

    //clear matched cards counter
    matchedCards = 0;

    //clear interval
    clearInterval(time);

    //shuffle cards
    shuffledCards = shuffle([...cards]);
    shuffleCards();

    //make all stars visible
    [1,2].map(e => {
        stars[e].style.display = ""
    });

    //set timer
    timer.innerHTML = "0 mins 0 sec";
    timerStart = true;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//replacing card on the board, removing all cards
function shuffleCards() {
    deck.innerHTML = "";
    [...shuffledCards].map(e => {
        e.classList.remove("show", "open", "match", "disabled");
        deck.appendChild(e);
    });
}

//set game timer
function setGameTimer(){
    seconds = 0;
    minutes = 0;
    time = setInterval(() => {
        seconds++;

        if(seconds === 60){
            minutes++;
            seconds = 0;
        }

        timer.innerHTML = `${minutes} mins ${seconds} sec`;
    }, 1000);
}

//clicking on card
function checkCards(){
    [...shuffledCards].map(card => {
        card.addEventListener("click", function(e){
            if(timerStart) {
                setGameTimer();
                timerStart = false;
            }
            if(openCards.length < 2){
                this.classList.toggle("open");
                this.classList.toggle("show");
                this.classList.toggle("disabled");
            }
            checkMatch();
        })
    });
}

//matching cards
function checkMatch() {
    if(openCards.length === 2){
        moves++;
        movesCounter.innerHTML = moves;
        if(openCards[0].innerHTML === openCards[1].innerHTML){
            [...openCards].map(e => {
                e.classList.remove("open", "show")
                e.classList.add("match");
            });
            checkResult();
        }else{
            setTimeout(() => [...openCards].map(e => {
                e.classList.remove("open", "show", "disabled");
            }), 1000);
        }

    }
    countMoves(moves);
}
//match check
function checkResult(){
    matchedCards += 1;

    if(matchedCards === 8){
        clearInterval(time);
        swal({
            title: "Congratulations !!!",
            text: sessionStorage.getItem("moves") === null ? `You won with time: ${minutes} min ${seconds} sec \nand ${scores} scores (${moves} moves)` : `You won with time: ${minutes} min ${seconds} sec \nand ${scores} scores (${moves} moves)! \n Last time you had ${sessionStorage.getItem("moves")} moves`,
            type: "success",
            confirmButtonText: "Play again!"
        }).then(function(isConfirm) {
            if (isConfirm) {
                initGame();
            }
        })

        sessionStorage.setItem("moves", moves);
    }
}

//move counter
function countMoves(moves){
    if(moves === 10){
        scores = 2;
        stars[2].style.display = "none";
    }else if(moves === 15){
        scores = 1;
        stars[1].style.display = "none";
    }
}

