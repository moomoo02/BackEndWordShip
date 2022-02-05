import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();

app.use(cors());

// const io = new Server(server, {
//   cors: { origin: "*" },
// });

const server = http.createServer(app);

const wss = new WebSocketServer({ server: server, cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

let words = [];

app.get("/words", function (req, res, next) {
  res.send(words);
});

app.post("/words", function (req, res) {
  try {
    words.push(req.body);
  } catch (err) {
    res.send(err);
  }
  res.send(Object.keys(req.body)[0]);
  //res.send(req.body);
});

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(message);
  });
});

server.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
