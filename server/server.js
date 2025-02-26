const WebSocket = require("ws");
const players = [];
const wss = new WebSocket.Server({ port : 8082 });

wss.on("connection", ws => {
    console.log("New Client Connected");
    players.push(ws);

    
    ws.on("message", (event) => {
        for(let i = 0 ; i < players.length ; i++) {
            if(players[i] != ws)
                players[i].send(event.toString());
        }
    });

    ws.on("close", () => {
        console.log("Client has disconnected");
        
    });
});

