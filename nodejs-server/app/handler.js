const {randomInt, randomUUID} = require("crypto");
module.exports = (io, socket, clients,rooms) => {
    const joinRoom = function (data) {
        if(data.pin in rooms){
            client().pin = data.pin;
            client().nickname = data.nickname;
            if(rooms[data.pin].players.length === 0)
                rooms[data.pin].leader = uuid();
            delete rooms[data.pin].reserved.splice(rooms[data.pin].reserved.indexOf(uuid()), 1);
            rooms[data.pin].players.push(uuid());
            socket.join(data.pin);
            getClientInfo();
            getRoomInfoPin(data.pin);
            socket.to(data.pin).emit('notification', {'header': 'Joined', 'message': data.nickname + ' has joined the lobby', 'severity': 'info'});

        }
        else{
            delete client()['room'];
            delete client()['nickname'];
            socket.emit('joined-room', {'success': false});
            socket.emit('notification', {'severity':'error', 'header': 'Error', 'message': 'Lobby not found'})
        }
    };

    const getClientInfo = function () {
        socket.emit('client-info', client());
    };

    const createRoom = function () {
        let pin = 0
        while(pin === 0 || pin in rooms)
            pin = randomInt(1111, 9999).toString();
        rooms[pin] = {'pin': pin, 'players': [], 'capacity': 6, 'reserved': []};
        socket.emit('created-room', pin);
        console.log('Created lobby', pin);
    };

    const getRoomInfo = function () {
        if('pin' in client())
            getRoomInfoPin(client().pin);
    };

    function getRoomInfoPin(pin) {
        console.log('get room info', pin)
        if(pin in rooms){
            let room = rooms[pin];
            let players = [];
            for(const id of room.players){
                players.push(clients[id]);
            }
            let reserved = [];
            for(const id of room.reserved){
                reserved.push(clients[id]);
            }
            io.to(pin).emit('room-info', {'exists': true, 'capacity': room.capacity, 'players': players, 'reserved': reserved, 'pin': pin, 'leader': room.leader})
        }
        else
            socket.emit('room-info', {'exists': false})
    }

    function getRoomInfoPinSingle(pin) {
        console.log('get room info single', pin)
        if(pin in rooms){
            let room = rooms[pin];
            let players = [];
            for(const id of room.players){
                players.push(clients[id]);
            }
            let reserved = [];
            for(const id of room.reserved){
                reserved.push(clients[id]);
            }
            socket.emit('room-info', {'exists': true, 'capacity': room.capacity, 'players': players, 'reserved': reserved, 'pin': pin, 'leader': room.leader})
        }
        else
            socket.emit('room-info', {'exists': false})
    }

    const joinReserved = function (pin){
        if(pin in rooms){
            client().pin = pin;
            rooms[pin].reserved.push(uuid());
        }
        else {
            delete client()['room'];
            socket.emit('notification', {'severity': 'error', 'header': 'Error', 'message': 'An error occurred'})
        }
        console.log(rooms[pin])
    }

    const checkLobby = function (pin) {
        if(pin in rooms)
            socket.emit('room-info', {'exists': true, 'pin': pin});
        else
            socket.emit('room-info', {'exists': false});
    };

    const leaveLobby = function (data) {
        if(client().pin in rooms){

            socket.to(client().pin).emit('notification', {'severity': 'info', 'header': 'Info', 'message': client().nickname + ' has left the lobby'})
            socket.leave(client().pin);
            delete rooms[client().pin].players.splice(rooms[client().pin].players.indexOf(uuid()), 1)

            if(rooms[client().pin].players.length !== 0 && rooms[client().pin].leader === uuid()){
                rooms[client().pin].leader = rooms[client().pin].players[0]
            }
            getRoomInfoPin(client().pin);
            if (data) {
                delete client().pin
                delete client().nickname
            }
        }
    };
    const uuid = () => {
        return socket.handshake.query.uuid
    };
    const client = () => {
        return clients[socket.handshake.query.uuid];
    };
    socket.on("join-lobby", joinRoom);
    socket.on("get-client-info", getClientInfo);
    socket.on("create-room", createRoom);
    socket.on("get-room-info", getRoomInfo);
    socket.on("get-room-info-pin", getRoomInfoPin);
    socket.on("get-room-info-pin-single", getRoomInfoPinSingle);
    socket.on("leave-lobby", leaveLobby);
    socket.on("check-lobby", checkLobby);
    socket.on("join-reserved", joinReserved);

    if(uuid() === ''
        || !(uuid() in clients)
        || client().status === 'connected'){
        socket.handshake.query.uuid = randomUUID();
        clients[uuid()] = {};
        console.log('connected - New:', uuid());
    }
    else{
        console.log('connected:', uuid());
        if('pin' in client() && 'nickname' in client())
            joinRoom({'pin': client().pin, 'nickname': client().nickname})
    }
    client().timestamp = Date.now();
    client().status = 'connected';
    client().uuid = uuid();

    socket.conn.on("close", () => {
        client().status = 'disconnected';
        leaveLobby(false);
        console.log('disconnected:', uuid())
    });
    io.to(socket.id).emit('set-uuid', {'uuid': uuid()})
}