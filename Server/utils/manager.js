class CommunicationManager {
  constructor() {
    this.board = null;
    this.client = null;
  }

  onNewBoardData(data) {
    if (this.client) {
      if (data == "emergency") {
        console.log("sent emergency");
        return this.client.send("emergency");
      }

      this.client.send("data: " + data);
      console.log("sent new client data: %s", data);
    }
  }

  registerBoard(board) {
    this.board = board;

    // setTimeout(() => this.board.send("registered"), 500);
    this.board.send("registered");

    if (this.client) {
      this.client.send("board ready");
    }

    this.board.on("message", (data) => this.onNewBoardData(data));

    console.log("board registered");
  }

  registerClient(client) {
    this.client = client;

    if (this.board) {
      this.client.send("board ready");
    }

    console.log("client registered");
  }

  registerDevice(name, ws) {
    ws.removeAllListeners("message");
    if (name == "board") {
      return this.registerBoard(ws);
    } else if (name == "client") {
      return this.registerClient(ws);
    }
  }

  unregisteredConnectionHandler(ws) {
    // When device is not registered

    console.log("Connected to a device!");

    ws.on("error", console.error);

    const registerDevice = this.registerDevice.bind(this);

    ws.on("message", (data) => {
      console.log("received register attempt: %s", data);

      if (data.slice(0, 9) == "register:") {
        registerDevice(data.slice(10), ws);
      }
    });
  }

  setSocket(socket) {
    this.socket = socket;
  }

  sendToClient(data) {
    if (this.socket) {
      this.socket.emit("message", data);
    }
  }
}

module.exports = { CommunicationManager };
