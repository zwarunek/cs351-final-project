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
const {randomUUID} = require("crypto");
const {join} = require("path");
clients = {};
rooms = {};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    clientuuid = socket.handshake.query.uuid;
    // console.log(clients);
    if(clientuuid === ''
        || !(clientuuid in clients)
        || clients[clientuuid].status === 'connected'){
        clientuuid = randomUUID();
        clients[clientuuid] = {};
        console.log('connected - New:', clientuuid);
    }
    else{
        console.log('connected:', clientuuid);
        if('room' in clients[clientuuid])
            join(clients[clientuuid].room)
    }
    clients[clientuuid].timestamp = Date.now();
    clients[clientuuid].status = 'connected';
    clients[clientuuid].uuid = clientuuid;
    socket.handshake.query.uuid = clientuuid;
    // socket.handshake.session.save();
    io.to(socket.id).emit('set-uuid', {'uuid': clientuuid})

    handler(io, socket, clients, rooms);

    socket.conn.on("close", () => {
        clients[socket.handshake.query.uuid].status = 'disconnected';
        console.log('disconnected:', socket.handshake.query.uuid)
    });
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
