//Declare variables
var letterPool = [];
var guessRemaining;
var lettersGuessed = [ ];
var wordList = [];
var randomWord;
var guessWord = [];
var winCount = 0;
var gameOver;

//Declare canvas context so we can draw hangman
var hangman = document.getElementById("hangman");
var context = hangman.getContext('2d');

//Delcare audio element so we can build our audio function
var winMusic = document.getElementById("winMusic"); 
winMusic.volume = 0.2; //save eardrums
var themeMusic = document.getElementById("themeMusic");
themeMusic.volume = 0.2; // save eardrums
var dieMusic = document.getElementById("dieMusic");
dieMusic.volume = 0.2; // save eardrums

//game function to setup new game
playGame = function () {
    //Setup new game
    letterPool = [...'abcdefghijklmnopqrstuvwxyz'];
    guessRemaining = 10;
    lettersGuessed = [];
    gameOver = false;
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
    console.log("shhh dont tell anyone, the secret word is: " + randomWord); //left in to always know the answer
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

//Build array of parts so we can draw them based of remaining guesses index
drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 

playGame();
buildLetterButtons();

//setup html elements
document.getElementById("winCount").innerHTML = "Total times Midgar has been saved: " + winCount;
document.getElementById("letterPool").innerHTML = "Available letters to choose from: <br>" + letterPool.join(" ");
document.getElementById("guessRemaining").innerHTML = "Guesses left before Midgar is destroyed: " + guessRemaining;
document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: <br>" + lettersGuessed.join(" ");
document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");

function checkWord(letter) {
    if(!gameOver){
        var choosen = false;
        document.getElementById("instruction").style.display = "none";
        if(letterPool.indexOf(letter) != -1){ //dont register no letter key strokes as guesses
            if(guessRemaining != 0){ //check we have lives left before proceeding
                //check if letter is in index of letter already guessed
                if (lettersGuessed.indexOf(letter) === -1){ //we have not guess it yet, add to guessed letters and check if part of word
                    lettersGuessed.push(letter);
                    document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: <br>" + lettersGuessed.join(" ");
                    letterPool = letterPool.filter(element => element !== letter); //remove letter from letterPool before we update html DOM
                    document.getElementById("letterPool").innerHTML = "Available letters to choose from: <br>" + letterPool.join(" ");
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
                    document.getElementById("guessRemaining").innerHTML = "Guesses left before Midgar is destroyed: " + guessRemaining;
                }

                // check if our guessword array is fully completed or if we have ran out of guesses
                if (guessWord.join("").replace(/ - /g, " ") === randomWord){
                    document.getElementById("gameStatus").innerHTML = "You Win! The city of Midgar has been saved! " + randomWord.toUpperCase() + " was the secret word!<br>Click on play again or wait 5 seconds for another game to start.";
                    document.getElementById("newGame").innerHTML = "Play Again!";
                    gameOver = true;
                    winCount++;
                    winMusic.play();
                    setTimeout(function(){ nextGame()}, 7000);
                }
                else if (guessRemaining === 0) {
                    document.getElementById("gameStatus").innerHTML = "Oh No, there's no more time left, the Diamond Weapon has destroyed Midgar, the secret word was " + randomWord.toUpperCase() + ".<br>Click on play again or wait 5 seconds for another game to start.";
                    document.getElementById("newGame").innerHTML = "Play Again!";
                    gameOver = true;
                    dieMusic.play();
                    setTimeout(function(){ nextGame()}, 7000);
                }

                //update html for guess word to show progress
                document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
            }
        }
    }
}

function nextGame(){
    context.clearRect(0, 0, 400, 400); //clear canvas

    playGame(); //reset game
    winMusic.pause(); //stop audio if clicked before done playing sounds
    winMusic.currentTime =0;
    dieMusic.pause(); //stop audio if clicked before done playing sounds
    dieMusic.currentTime =0;

    document.getElementById("letterButtons").innerHTML = ""; //reset letterButton div so we can play again
    buildLetterButtons(); //rebuild letterbutton list

    //reset page elements for fresh game
    document.getElementById("gameStatus").innerHTML = "";
    document.getElementById("instruction").style.display = "block";
    document.getElementById("winCount").innerHTML = "Total times Midgar has been saved: " + winCount;
    document.getElementById("letterPool").innerHTML = "Available letters to choose from: <br>" + letterPool.join(" ");
    document.getElementById("guessRemaining").innerHTML = "Guesses left before Midgar is destroyed: " + guessRemaining;
    document.getElementById("lettersGuessed").innerHTML = "Letters already guessed: <br>" + lettersGuessed.join(" ");
    document.getElementById("guessWord").innerHTML = "Word to guess: <br>" + guessWord.join(" ");
    document.getElementById("newGame").innerHTML = "New Word";
 }

//cpatured letter pressed by user
document.onkeyup = function(event){
    if(!gameOver){
        var letter = String.fromCharCode(event.keyCode).toLowerCase();
        if(letterPool.indexOf(letter) != -1){
            $("li:contains('" + letter + "')")[0].setAttribute("class", "clicked");
            checkWord(letter);
        }
    }
}

//Play theme music if icon is selected
document.getElementById('musicButton').onclick = function() {
    if(themeMusic.paused){
        themeMusic.play();
        themeMusic.loop = true;
        document.getElementById('musicButton').style.color = "#8D8B8B";
    }
    else{
        themeMusic.pause();
        document.getElementById('musicButton').style.color = "white";
    }
}


//Reset game when new game button is clicked
document.getElementById('newGame').onclick = function() {
    nextGame();
}

