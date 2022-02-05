const fs = require('fs')

/* Take in an input inputWord and returns a Godot bbcode_text formatted colored string to be sent back to Godot 

    @params `inputWord`: the word that was "killed" and being used to guess
            `hotWord`: the word that is the "wordle word" that the player needs to guess to win (spawner loses if this word is guessed)
    @return a string with color codes that is formatted for Godot

*/
function formatGuess(inputWord, hotWord) {
    let input = inputWord.toUpperCase();
    hotWord = hotWord.toUpperCase();

    let correctArr = ["", "", "", "", ""]; // correctArr is just the backend friendly array
    let godotArr = ["", "", "", "", ""]; // godotArr is the Godot friendly text that will be joined and returned
    let hotArry = hotWord.split('');
    let inputArr = input.split('');

    // Get all correct green letters
    for (let i = 0; i < hotArry.length; i++) {
        if (inputArr[i] === hotArry[i]) {
            correctArr[i] = chalk.green(hotWord.at(i));
            godotArr[i] = color(hotWord.at(i), "green");
            hotArry[i] = "";
            inputArr[i] = "";
        }
    }

    // Get all the yellow letters
    for (let i = 0; i < hotArry.length; i++) {
        // If the current spot is not correct, check to see if it's included in the hotArry
        if (correctArr[i] === "" && inputArr[i] !== "") {
            if (hotArry.includes(inputArr[i])) {
                correctArr[i] = chalk.yellow(inputArr[i]);
                godotArr[i] = color(inputArr[i], "yellow");
                hotArry[hotArry.indexOf(inputArr[i])] = "";
            } else {
                correctArr[i] = chalk.red(inputArr[i]);
                godotArr[i] = color(inputArr[i], "red");
            }
        }
    }

    console.log(correctArr.join(''));
    return godotArr.join('');
}

function color(letter, color) {
    return `[color=${color}]${letter}[/color]`
}


/* Retrieve all words from the json file and returns an array of 5 letter capital letters strings

    @params `inputWord`: the word that was "killed" and being used to guess
            `hotWord`: the word that is the "wordle word" that the player needs to guess to win (spawner loses if this word is guessed)
    @return a string with color codes that is formatted for Godot

*/
export function retrieveValidWordList() {
    const fileName = './targets.json' // wordlist from https://github.com/lynn/hello-wordl
    const allWords = JSON.parse(fs.readFileSync(fileName));
    return allWords.filter(word => word.length === 5 && /^[a-zA-Z]+$/.test(word));
}

export function generateHotWord() {
    const validWords = retrieveValidWordList();
    console.log(validWords);
    return validWords[randomInt(0, validWords.length)];
}

function randomInt(min, max) {
    // min and max inclusive
    return Math.floor(Math.random() * (max - min + 1) + min)
}