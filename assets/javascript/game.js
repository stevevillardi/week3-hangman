//Declare variables
var letterPool = [];
var guessRemaining;
var lettersGuessed = [ ];
var wordList = [];
var randomWord;
var guessWord = [];
var winCount = 0;

playGame = function () {
    //Setup new game
    letterPool = [...'abcdefghijklmnopqrstuvwxyz'];
    guessRemaining = 10;
    lettersGuessed = [];
    wordList = ["cloud","tifa","aerith","barret","yuffie","vincent","zack","red","caitsith","cid","sephiroth","jenova","rufus","hojo","avalanche","marlene","midgar","materia","chocobo","shiva","ifrit","titan","odin","leviathan","bahamut","phoenix","hades","typhon"]
    randomWord = wordList[Math.floor(Math.random()*wordList.length)];
    guessWord = [];
    canvas();

    //create blank letter display
    for (char in randomWord){
        guessWord.push("_");
    }
}

var animate = function () {
    var drawMe = guessRemaining ;
    drawArray[drawMe]();
}

//Declare canvas context so we can draw hangman
var hangman = document.getElementById("hangman");
var context = hangman.getContext('2d');

//Sets canvas options
canvas =  function(){
    context.beginPath();
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
};

//sets context to be able to create arc for the head shape
head = function(){
    context.beginPath();
    context.strokeStyle = "#808080";
    context.arc(60, 25, 10, 0, Math.PI*2, true);
    context.stroke();
}

//base function to draw all lines
draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
}

//All functions to draw hangman lines using canvas, not going to lie, found the coord functions on google.
frame1 = function() {
    draw (0, 150, 150, 150);
};

frame2 = function() {
    draw (10, 0, 10, 150);
};

frame3 = function() {
    draw (0, 5, 70, 5);
};

frame4 = function() {
    draw (60, 5, 60, 15);
};

torso = function() {
    draw (60, 36, 60, 70);
    context.strokeStyle = "#808080";
};

rightArm = function() {
    draw (60, 46, 100, 50);
    context.strokeStyle = "#808080";
};

leftArm = function() {
    draw (60, 46, 20, 50);
    context.strokeStyle = "#808080";
};

rightLeg = function() {
    draw (60, 70, 100, 100);
    context.strokeStyle = "#808080";
};

leftLeg = function() {
    draw (60, 70, 20, 100);
    context.strokeStyle = "#808080";
};

//Build array of parts so we can draw them based of remaining guesses index
drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 


playGame();

//build audio source and function to play win music
var winMusic = document.getElementById("winMusic"); 
function playWinMusic() { 
    winMusic.play(); 
} 

//build stop function when we clear game sound start back at 0 seconds
function stopWinMusic() { 
    winMusic.pause();
    winMusic.currentTime = 0;
} 

document.getElementById("winCount").innerHTML = "Total Wins: " + winCount;
document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool.join(" ");
document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed.join(" ");
document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");

//cpatured letter pressed by user
document.onkeyup = function(event) {

    var letter = String.fromCharCode(event.keyCode).toLowerCase();
    var choosen = false;
    //check if letter is in index of letter already guessed
    if (lettersGuessed.indexOf(letter) === -1){ //we have not guess it yet, add to guessed letters and check if part of word
        lettersGuessed.push(letter);
        document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed.join(" ");
        letterPool = letterPool.filter(element => element !== letter); //remove letter from letterPool before we update html DOM
        document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool.join(" ");
        for (var i =0; i < randomWord.length; i++){
            if (letter === randomWord[i]){
                guessWord[i] = letter;
                choosen = true;
            }
        }
    }
    else{ //guessed already so dont subtract a life
        choosen = true;
    }

    //if letter has not already been choosen subtract a life
    if(!choosen){
        guessRemaining--;
        animate();
        document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
    }

    // check if our guessword array is fully completed or if we have ran out of guesses
    if (guessWord.join("") === randomWord){
        console.log("YOU WIN!");
        document.getElementById("gameStatus").innerHTML = "YOU WIN! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
        document.getElementById("newGame").innerHTML = "Play Again!";
        winCount++;
        playWinMusic();
    }
    else if (guessRemaining === 0) {
        console.log("OUT OF GUESSES, YOU LOSE!");
        document.getElementById("gameStatus").innerHTML = "OUT OF GUESSES, SORRY YOU LOSE! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
        document.getElementById("newGame").innerHTML = "Play Again!";
    }

    //update html for guess word to show progress
    document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
    console.log("word chosen: " + randomWord);


}

//Reset game when new game button is clicked
document.getElementById('newGame').onclick = function() {
    context.clearRect(0, 0, 400, 400);
    playGame();
    stopWinMusic();
    document.getElementById("gameStatus").innerHTML = "";
    document.getElementById("winCount").innerHTML = "Total Wins: " + winCount;
    document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool.join(" ");
    document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
    document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed.join(" ");
    document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
    document.getElementById("newGame").innerHTML = "New Word";
}

