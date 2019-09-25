//Declare variables
var letterPool = [];
var guessRemaining;
var lettersGuessed = [ ];
var wordList = [];
var randomWord;
var guessWord = [];
var winCount = 0;

//Declare canvas context so we can draw hangman
var hangman = document.getElementById("hangman");
var context = hangman.getContext('2d');

//Delcare audio element so we can build our audio function
var winMusic = document.getElementById("winMusic"); 

//game function to setup new game
playGame = function () {
    //Setup new game
    letterPool = [...'abcdefghijklmnopqrstuvwxyz'];
    guessRemaining = 10;
    lettersGuessed = [];
    wordList = ["nibelheim","mount nibel","kalm","junon harbor","gold saucer","costa del sol","cosmo canyon","corel prison","city of the ancients","chocobo ranch","cactuar island","bone village","ancient forest","cloud strife","tifa lockhart","aerith gainsborough","barret wallace","yuffie kisaragi","vincent valentine","red xiii","cait sith","cid highwind","sephiroth","jenova","rufus shinra","hojo","avalanche","marlene","midgar","materia","chocobo","shiva","ifrit","titan","odin","leviathan","bahamut","phoenix","hades","typhon"];
    randomWord = wordList[Math.floor(Math.random()*wordList.length)];
    guessWord = [];
    canvas();

    //create blank letter display
    for(var i=0; i < randomWord.length; i++) {
        if(randomWord[i] === " "){
            guessWord.push(" - ");
        }
        else{
            guessWord.push("_");
        }
    }
}

//draws the index of the remaining guess to the hangman canvas
animate = function () {
    var drawMe = guessRemaining ;
    drawArray[drawMe]();
}

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

//Draw letter buttons to screen for mobile players
buildLetterButtons = function() {
    var buttonDiv = document.getElementById("letterButtons");
    var buttonList = document.createElement("ul");
    for(var i=0; i < letterPool.length; i++){
        buttonItem = document.createElement("li");
        buttonItem.className = "buttonPress";
        buttonItem.innerHTML = letterPool[i];
        checkClick();
        buttonList.appendChild(buttonItem);
        buttonDiv.appendChild(buttonList);
    }
}

//press letter by clicking button
checkClick = function () {
    buttonItem.onclick = function () {
        this.setAttribute("class", "clicked");
        var clickedGuess = this.innerHTML;
        checkWord(clickedGuess);
    }
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

//build audio source and function to play win music
function playWinMusic() { 
    winMusic.play(); 
} 

//build stop function when we clear game sound start back at 0 seconds
function stopWinMusic() { 
    winMusic.pause();
    winMusic.currentTime = 0;
} 

//Build array of parts so we can draw them based of remaining guesses index
drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 

playGame();
buildLetterButtons();
console.log("shhh dont tell anyone, the secret word is: " + randomWord); //left in to always know the answer

//setup html elements
document.getElementById("winCount").innerHTML = "Total Wins: " + winCount;
document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool.join(" ");
document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed.join(" ");
document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");

function checkWord(letter) {
    var choosen = false;
    if(letterPool.indexOf(letter) != -1){ //dont register no letter key strokes as guesses
        if(guessRemaining != 0){ //check we have lives left before proceeding
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
            if (guessWord.join("").replace(" - ", " ") === randomWord){
                document.getElementById("gameStatus").innerHTML = "YOU WIN! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
                document.getElementById("newGame").innerHTML = "Play Again!";
                winCount++;
                playWinMusic();
            }
            else if (guessRemaining === 0) {
                document.getElementById("gameStatus").innerHTML = "OUT OF GUESSES, SORRY YOU LOSE! THE CORRECT WORD WAS: " + randomWord.toUpperCase();
                document.getElementById("newGame").innerHTML = "Play Again!";
            }

            //update html for guess word to show progress
            document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
        }
    }
}

//cpatured letter pressed by user
document.onkeyup = function(event){
    var letter = String.fromCharCode(event.keyCode).toLowerCase();
    $("li:contains('" + letter + "')")[0].setAttribute("class", "clicked");
    checkWord(letter);
}



//Reset game when new game button is clicked
document.getElementById('newGame').onclick = function() {
    context.clearRect(0, 0, 400, 400); //clear canvas

    playGame(); //reset game
    stopWinMusic(); //stop audio if clicked before done playing sounds

    document.getElementById("letterButtons").innerHTML = ""; //reset letterButton div so we can play again
    buildLetterButtons(); //rebuild letterbutton list

    //reset page elements for fresh game
    document.getElementById("gameStatus").innerHTML = "";
    document.getElementById("winCount").innerHTML = "Total Wins: " + winCount;
    document.getElementById("letterPool").innerHTML = "Available letters to choose from: " + letterPool.join(" ");
    document.getElementById("guessRemaining").innerHTML = "Number of guesses remaining: " + guessRemaining;
    document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: " + lettersGuessed.join(" ");
    document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
    document.getElementById("newGame").innerHTML = "New Word";

}

