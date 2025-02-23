const WebSocket = require("ws");

const wss = new WebSocket.Server({ port : 8082 });

wss.on("connection", ws => {
    console.log("New Client Connected");

    ws.on("message", (event) => {
        console.log(event.toString());
    });

    ws.on("close", () => {
        console.log("Client has disconnected");

        
    });
});

