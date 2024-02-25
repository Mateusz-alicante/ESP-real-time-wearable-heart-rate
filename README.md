## Components

The project consists of 3 interconnected components:

1. **Data Collection**: ESP8266 on board controller code that collects data and connects to the server as a WebScoket client.

2. **Server**: Node.js server that handles the WebSocket connections and serves collected data to the Client.

3. **Client**: Next.js web application that connects to the server as a WebSocket client and displays the data in real-time.

## Setup

1. Replace wifi credentials in the esp8266 controller file (make sure that this is the same network as the one you plan to run the server on).

2. Run the server in the `Server` directory with `node main.js`.

3. Run the client in the `Client` directory with `npm run dev`.

4. Flash the esp8266 controller with the code in the `Board` directory.
