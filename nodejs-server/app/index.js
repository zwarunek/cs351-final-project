const express = require('express')
const app = express()

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const PORT = process.env.PORT || 5000

const handler = require("./handler");
clients = {};
rooms = {};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    handler(io, socket, clients, rooms);

});

server.listen(PORT, () => {
    console.log('listening on', PORT);
});
function myLoop() {
    setTimeout(function() {
        for(const [key, value] of Object.entries(clients)){
            if(Date.now() - value.timestamp > 100000
                && value.status === 'disconnected') {
                delete clients[key];
            }
        }
        for(const [key, value] of Object.entries(rooms)){
            if(value['players'] === 0) {
                delete rooms[key];
            }
        }
        myLoop();
    }, 60000)
}
myLoop();
