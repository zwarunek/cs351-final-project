const {randomInt, randomUUID} = require("crypto");
module.exports = (io, socket, clients,rooms) => {
    const joinRoom = function (data) {
        if(data.pin in rooms){
            clients[uuid()].pin = data.pin;
            clients[uuid()].nickname = data.nickname;
            if(rooms[data.pin].players.length === 0)
                rooms[data.pin].leader = uuid();
            rooms[data.pin].players.push(uuid());
            socket.join(data.pin);
            getClientInfo();
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
        socket.emit('created-room', pin);
        console.log('Created lobby', pin);
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
        if(clients[uuid()].pin in rooms){

            socket.to(clients[uuid()].pin).emit('notification', {'severity': 'info', 'header': 'Info', 'message': clients[uuid()].nickname + ' has left the lobby'})
            socket.leave(clients[uuid()].pin);
            delete rooms[clients[uuid()].pin].players.splice(rooms[clients[uuid()].pin].players.indexOf(uuid()), 1)

            if(rooms[clients[uuid()].pin].players.length !== 0 && rooms[clients[uuid()].pin].leader === uuid()){
                rooms[clients[uuid()].pin].leader = rooms[clients[uuid()].pin].players[0]
            }
            getRoomInfoPin(clients[uuid()].pin);
            if (data) {
                delete clients[uuid()].pin
                delete clients[uuid()].nickname
            }
        }
    };

    function getRoomInfoPin(pin) {
        if(pin in rooms){
            let room = rooms[pin];
            let players = [];
            for(const id of room.players){
                players.push(clients[id]);
            }
            io.to(pin).emit('room-info', {'exists': true, 'players': players, 'pin': pin, 'leader': room.leader})
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
    // console.log(clients);
    if(uuid() === ''
        || !(uuid() in clients)
        || clients[uuid()].status === 'connected'){
        socket.handshake.query.uuid = randomUUID();
        clients[uuid()] = {};
        console.log('connected - New:', uuid());
    }
    else{
        console.log('connected:', uuid());
        if('pin' in clients[uuid()] && 'nickname' in clients[uuid()])
            joinRoom({'pin': clients[uuid()].pin, 'nickname': clients[uuid()].nickname})
    }
    clients[uuid()].timestamp = Date.now();
    clients[uuid()].status = 'connected';
    clients[uuid()].uuid = uuid();

    socket.conn.on("close", () => {
        clients[uuid()].status = 'disconnected';
        leaveLobby(false);
        //     delete clients[socket.handshake.query.uuid].pin
        // if('nickname' in clients[socket.handshake.query.uuid])
        //     delete clients[socket.handshake.query.uuid].nickname
        console.log('disconnected:', uuid())
    });
    // socket.handshake.session.save();
    io.to(socket.id).emit('set-uuid', {'uuid': uuid()})
}
