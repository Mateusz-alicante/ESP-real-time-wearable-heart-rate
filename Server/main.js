const { WebSocketServer } = require("ws");
const express = require("express");
const { CommunicationManager } = require("./utils/manager");

// ========= WebSocket Server =========

const manager = new CommunicationManager();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (data) => {
  console.log("got message", data);
  manager.unregisteredConnectionHandler(data);
});

console.log("WebSocketServer running at ws://localhost:8080/");

// ========= Express Server =========

const app = express();
app.get("/", function (req, res) {
  console.log("Received LED toggle");
  res.send("Received LED toggle");
  if (boardConnection) {
    boardConnection.send("toggle");
  }
});

app.listen(3000);
console.log("Server running at http://localhost:3000/");
