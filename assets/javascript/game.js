//Create variables to start our game
const letterPool = [...'abcdefghijklmnopqrstuvwxyz'];
var guessRemaining = 10;
var letterGuessed = [];

//
//detect key press
//check if pressed key is already guessed| is part or word | not part of word
// if not guessed and not part of word guesses-- add letter to guessed letters
//if not guessed and part of word, add to word map and add letter to guessed letters
//if guesses remaining = 0 game over
// if word solved = you win

document.getElementById("guessRemain").innerHTML = "New text!";