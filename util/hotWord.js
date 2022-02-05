const fs = require('fs')
export function retrieveWordList() {
    const fileName = '../sbhacks/BackEndWordShip/util/targets.json' // wordlist from https://github.com/lynn/hello-wordl
    return JSON.parse(fs.readFileSync(fileName));
}

export function generateHotWord() {
    const allWords = retrieveWordList();
    const validWords = allWords.filter(word => word.length === 5 && /^[a-zA-Z]+$/.test(word));
    console.log(validWords);
    return validWords[randomInt(0, validWords.length)];
}

function randomInt(min, max) {
    // min and max inclusive
    return Math.floor(Math.random() * (max - min + 1) + min)
}