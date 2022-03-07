const {join} = require("path");
const {randomInt} = require("crypto");
module.exports = (io, socket, clients,rooms) => {
    const joinRoom = function (data) {
        if(data.pin in rooms){
            console.log(data);
            clients[uuid()].pin = data.pin;
            clients[uuid()].nickname = data.nickname;
            rooms[data.pin].players.push(uuid())
            socket.join(data.pin);
            getClientInfo();
            // getRoomInfoPin(data.pin);
            socket.to(data.pin).emit('notification', {'header': 'Joined', 'message': data.nickname + ' has joined the lobby', 'severity': 'info'});

        }
        else{
            delete clients[uuid()]['room'];
            delete clients[uuid()]['nickname'];
            socket.emit('joined-room', {'success': false});
            socket.emit('notification', {'severity':'error', 'header': 'Error', 'message': 'Lobby not found'})
        }
    };

    const getClientInfo = function () {
        socket.emit('client-info', clients[uuid()]);
    };

    const createRoom = function () {
        let pin = randomInt(1111, 9999).toString();
        while(pin in rooms)
            pin = randomInt(1111, 9999).toString();
        rooms[pin] = {'players': []};
        // joinRoom(pin);
        socket.emit('created-room', pin);
        console.log('Created lobby', pin);
        // clients[uuid()].room = pin;
        // clients[uuid()].nickname = data.nickname;
        // rooms[pin]['players'].push(uuid());
        // socket.join(pin);
        // console.log(io.of("/").adapter.rooms)
    };

    const getRoomInfo = function () {
        console.log('in room info', 'pin' in clients[uuid()])
        if('pin' in clients[uuid()])
            getRoomInfoPin(clients[uuid()].pin);
    };

    const checkLobby = function (pin) {
        if(pin in rooms)
            socket.emit('room-info', {'exists': true, 'pin': pin});
        else
            socket.emit('room-info', {'exists': false});
    };

    const leaveLobby = function (data) {
        socket.to(clients[uuid()].pin).emit('notification', {'severity': 'info', 'header': 'Info', 'message': clients[uuid()].nickname + ' has left the lobby'})
        socket.leave(clients[uuid()].pin);
        delete rooms[clients[uuid()].pin].players.splice(rooms[clients[uuid()].pin].players.indexOf(uuid()), 1)
        getRoomInfoPin(clients[uuid()].pin);
        if(data)
            delete clients[uuid()].pin


    };

    function getRoomInfoPin(pin) {
        console.log(pin, pin in rooms, rooms)
        if(pin in rooms){
            let room = rooms[pin];
            let players = [];
            for(const id of room.players){
                players.push(clients[id]);
            }
            console.log('emitting to room info')
            io.to(pin).emit('room-info', {'exists': true, 'players': players, 'pin': pin})
        }
        else
            socket.emit('room-info', {'exists': false})
    }
    const uuid = () => {
        return socket.handshake.query.uuid
    };
    socket.on("join-lobby", joinRoom);
    socket.on("get-client-info", getClientInfo);
    socket.on("create-room", createRoom);
    socket.on("get-room-info", getRoomInfo);
    socket.on("get-room-info-pin", getRoomInfoPin);
    socket.on("leave-lobby", leaveLobby);
    socket.on("check-lobby", checkLobby);
}
