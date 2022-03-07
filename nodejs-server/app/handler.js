const {join} = require("path");
const {randomInt} = require("crypto");
module.exports = (io, socket, clients,rooms) => {
    const joinRoom = function (data) {

        if(data.room in rooms){
            clients[uuid()].room = data.room;
            clients[uuid()].nickname = data.nickname;
            rooms[data.room].players.push(uuid())
            socket.join(data.room);
            socket.to(data.room).emit('notification', {'header': 'Joined', 'message': data.nickname + ' has joined the lobby', 'severity': 'info'});
            socket.emit('joined-room', {'success': true, 'pin': data.room});
        }
        else{
            delete clients[uuid()]['room'];
            delete clients[uuid()]['nickname'];
            socket.emit('joined-room', {'success': false});
            socket.emit('notification', {'severity':'error', 'header': 'Error', 'message': 'Lobby not found'})
        }
        console.log(io.of("/").adapter.rooms)
    };

    const getClientInfo = function () {
        socket.emit('client-info', clients[uuid()]);
    };

    const createRoom = function (data) {
        let pin = randomInt(1111, 9999).toString();
        while(pin in rooms)
            pin = randomInt(1111, 9999).toString();
        rooms[pin] = {'players': []};
        data.room = pin
        joinRoom(data);
        // socket.emit('created-room', pin);
        console.log('Created lobby', pin);
        // clients[uuid()].room = pin;
        // clients[uuid()].nickname = data.nickname;
        // rooms[pin]['players'].push(uuid());
        // socket.join(pin);
        // console.log(io.of("/").adapter.rooms)
    };

    const getRoomInfo = function () {
        if('room' in clients[uuid()])
            getRoomInfoPin(clients[uuid()].room);
    };

    const leaveLobby = function (data) {
        socket.to(clients[uuid()].room).emit('notification', {'severity': 'info', 'header': 'Info', 'message': clients[uuid()].nickname + ' has left the lobby'})
        socket.leave(clients[uuid()].room);
        delete rooms[clients[uuid()].room].players.splice(rooms[clients[uuid()].room].players.indexOf(uuid()), 1)
        getRoomInfoPin(clients[uuid()].room);
        if(data)
            delete clients[uuid()].room


    };

    const getUuid = function () {
        console.log(socket.handshake.session.uuid);
    };

    function getRoomInfoPin(pin) {
        if(pin in rooms){
            let room = rooms[pin];
            let players = [];
            for(const id of room.players){
                players.push(clients[id]);
            }
            io.to(pin).emit('room-info', {'exists': true, 'players': players, 'pin': pin})
        }
        else
            socket.emit('room-info', {'exists': false})
    }
    const uuid = () => {
        return socket.handshake.query.uuid
    };
    socket.on("get-uuid", getUuid);
    socket.on("join-room", joinRoom);
    socket.on("get-client-info", getClientInfo);
    socket.on("create-room", createRoom);
    socket.on("get-room-info", getRoomInfo);
    socket.on("leave-lobby", leaveLobby);
}
