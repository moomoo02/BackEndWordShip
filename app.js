import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { generateHotWord, checkIfvalid, formatGuess } from "./util/wordle.js";
import { randomInt } from "./util/wordle.js";


const app = express();

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocketServer({ server: server, cors: { origin: "*" } });

let hotWord = generateHotWord();

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

let words = [];

app.get("/words", function (req, res, next) {
  //   res.send(words);
  res.send(hotWord);
});

app.post("/words", function (req, res) {
  // use checkIfvalid to check if word is valid
  try {
    console.log("POST");
    let inputWord = req.body.input;
    let isDuplicate = words.includes(inputWord);
    let isWord = checkIfvalid(inputWord);
    if (!isDuplicate && isWord) {
      words.push(req.body.input);
      // Send the spawnWord event to Godot (and other clients for now)
      wss.clients.forEach(function each(client) {
        client.send(JSON.stringify({ event: "spawnWord", data: inputWord.toUpperCase() }));
      });
    } else if (!isWord) {
      res.send({ code: 0 });
      return;
    } else {
      res.send({ code: 1 });
      return;
    }
  } catch (err) {
    res.send(err);
  }

  res.send({ code: 2 });
});

wss.on("connection", (socket) => {
  console.log("connect");
  socket.on("message", (message) => {
    const messageEvent = JSON.parse(message.toString()); // Get the UTF-8 buffered data, turn to string, then turn to JS object with event and data attributes
    const data = messageEvent.data;
    const event = messageEvent.event;
    console.log(messageEvent);
    console.log(event);
    console.log(typeof event)
    // Figure out what event was sent
    if (event === "guess") {
      // the Godot player has killed a word, so play Wordle
      console.log(hotWord)
      const bbEncoded = formatGuess(data, hotWord);

      // send the result back to Godot
      const payload = {
        event: "guessResult",
        data: bbEncoded,
      };
      socket.send(JSON.stringify(payload));
      if (data.toUpperCase() === hotWord.toUpperCase()) {
        // Player has guessed the word
        const victory = {
          event: "victory",
          data: 1
        }
        socket.send(JSON.stringify(victory))
      }
    } else if (event === "startGame") {
      // restart the game with a new hotWord and new duplicate list
      hotWord = generateHotWord();
      words = [];
      spawnHotWord(hotWord);
      console.log("New hot word is: ", hotWord);
    } else {
      console.log("Unrecognized event: ", event);
    }
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Listening on http://localhost:5000");
});


function spawnHotWord(word) {
  const lowerSeconds = 30;
  const upperSeconds = 60;
  setTimeout(() => {
    // TODO: spawn hot word
    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify({ event: "hotWord", data: word }));
    });
  }, randomInt(lowerSeconds * 1000, upperSeconds * 1000));
}