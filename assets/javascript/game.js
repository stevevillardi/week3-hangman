//Declare variables
var letterPool = [];
var guessRemaining;
var lettersGuessed = [ ];
var wordList = [];
var randomWord;
var guessWord = [];

playGame = function () {
    //Setup new game
    letterPool = [...'abcdefghijklmnopqrstuvwxyz'];
    guessRemaining = 10;
    lettersGuessed = [];
    wordList = ["word","noun","thing","stuff"]
    randomWord = wordList[Math.floor(Math.random()*wordList.length)];
    guessWord = [];

    //create blank letter display
    for (char in randomWord){
        guessWord.push("_");
    }
}


frame1 = function() {
    draw (0, 150, 150, 150);
};
  
frame2 = function() {
    draw (10, 0, 10, 600);
};
 
frame3 = function() {
    draw (0, 5, 70, 5);
};
 
frame4 = function() {
    draw (60, 5, 60, 15);
};
 
torso = function() {
    draw (60, 36, 60, 70);
};
 
rightArm = function() {
    draw (60, 46, 100, 50);
};
 
leftArm = function() {
    draw (60, 46, 20, 50);
};
 
rightLeg = function() {
    draw (60, 70, 100, 100);
};
 
leftLeg = function() {
    draw (60, 70, 20, 100);
};



head = function(){
    hangman = document.getElementById("hangman");
    context = hangman.getContext('2d');
    context.beginPath();
    context.arc(60, 25, 10, 0, Math.PI*2, true);
    context.stroke();
}


canvas =  function(){
    hangman = document.getElementById("hangman");
    context = hangman.getContext('2d');
    context.beginPath();
    context.strokeStyle = "#fff";
    context.lineWidth = 2;
}

draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
}

drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 

// Animate man
var animate = function () {
    var drawMe = guessRemaining ;
    drawArray[drawMe]();
}

playGame();
canvas();

document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool;
document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed;
document.getElementById("guessWord").innerHTML = "Word to guess: " + guessWord.join(" ");


console.log("word chosen: " + randomWord);

//cpatured letter pressed by user
document.onkeyup = function(event) {

    var letter = String.fromCharCode(event.keyCode).toLowerCase();
    var choosen = false;
    //check if letter is in index of letter already guessed
    if (lettersGuessed.indexOf(letter) === -1){ //we have no guess it yet, add to guessed letters and check if part of word
        lettersGuessed.push(letter);
        document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed;
        letterPool = letterPool.filter(element => element !== letter); //remove letter from letterPool before we update html DOM
        document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool;
        for (var i =0; i < randomWord.length; i++){
            if (letter === randomWord[i]){
                guessWord[i] = letter;
                choosen = true;
            }
        }
    }
    else{ //guessed already so dont subtract a live
        choosen = true;
    }

    //if letter has not already been choosen subtract a live
    if(!choosen){
        guessRemaining--;
        animate();
        document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
    }

    // check if our guessword array is fully completed or if we have ran out of guesses
    if (guessWord.join("") === randomWord){
        console.log("YOU WIN!");
        document.getElementById("gameStatus").innerHTML = "YOU WIN! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
    }
    else if (guessRemaining === 0) {
        console.log("OUT OF GUESSES, YOU LOSE!");
        document.getElementById("gameStatus").innerHTML = "OUT OF GUESSES, SORRY YOU LOSE! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
    }

    //update html for guess word to show progress
    document.getElementById("guessWord").innerHTML = "Word to guess: " + guessWord.join(" ");

    console.log("guessed letter: " + letter);
    console.log("letters chosen: " + lettersGuessed);
    console.log("lives: " + guessRemaining);
    console.log("word chosen: " + randomWord);
    console.log("word guess: " + guessWord);

    document.getElementById('newGame').onclick = function() {
        document.getElementById("gameStatus").innerHTML = "";
        context.clearRect(0, 0, 400, 400);
        playGame();
    }
}

