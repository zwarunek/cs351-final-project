const {randomInt, randomUUID} = require("crypto");
const fs = require('fs');
const {join} = require("path");

let wordlistAnswers = {}
let wordlistGuesses = {}

createWordLists()

function createWordLists() {

  let files = fs.readdirSync(join(__dirname + '/assets/wordlists/'));
  for (let i in files) {
    let list = fs.readFileSync(join(__dirname + '/assets/wordlists/' + files[i]), 'utf8')
    if (files[i].substring(0, files[i].length - 4).endsWith('answers'))
      wordlistAnswers[files[i].substring(0, files[i].indexOf('-'))] = list.split(/\r?\n/)
    else
      wordlistGuesses[files[i].substring(0, files[i].indexOf('-'))] = list.split(/\r?\n/)
  }
}


module.exports = (io, socket, clients, rooms) => {

  const uuid = () => {
    return socket.handshake.query.uuid
  };
  const client = () => {
    return clients[socket.handshake.query.uuid];
  };
  const joinRoom = function (data) {
    if (data.pin in rooms) {
      client().pin = data.pin;
      client().nickname = data.nickname;
      if (rooms[data.pin].players.length === 0)
        rooms[data.pin].leader = uuid();
      delete rooms[data.pin].reserved.splice(rooms[data.pin].reserved.indexOf(uuid()), 1);
      rooms[data.pin].players.push(uuid());
      socket.join(data.pin);
      getClientInfo();
      getRoomInfoPin(data.pin);
      socket.to(data.pin).emit('notification', {
        'header': 'Joined',
        'message': data.nickname + ' has joined the lobby',
        'severity': 'info'
      });

    } else {
      delete client()['room'];
      delete client()['nickname'];
      socket.emit('joined-room', {'success': false});
      socket.emit('notification', {'severity': 'error', 'header': 'Error', 'message': 'Lobby not found'})
    }
  };

  const getClientInfo = function () {
    socket.emit('client-info', client());
  };

  const createRoom = function () {
    let pin = 0
    while (pin === 0 || pin in rooms)
      pin = randomInt(1111, 9999).toString();
    rooms[pin] = {
      'pin': pin,
      'players': [],
      'capacity': 6,
      'reserved': [],
      'ready': 0,
      'open': true,
      'status': 'lobby',
      'letters': 5,
      'guesses': 6
    };
    socket.emit('created-room', pin);
    console.log('Created lobby', pin);
  };

  const getRoomInfo = function () {
    if ('pin' in client())
      getRoomInfoPin(client().pin);
  };

  function getRoomInfoPin(pin) {
    if (pin in rooms) {
      let room = rooms[pin];
      let players = [];
      for (const id of room.players) {
        players.push(clients[id]);
      }
      let reserved = [];
      for (const id of room.reserved) {
        reserved.push(clients[id]);
      }
      io.to(pin).emit('room-info', {
        'exists': true,
        'capacity': room.capacity,
        'players': players,
        'reserved': reserved,
        'pin': pin,
        'leader': room.leader,
        'open': room.open,
        'letters': room.letters,
        'guesses': room.guesses
      })
    } else
      socket.emit('room-info', {'exists': false})
  }

  function getRoomInfoPinSingle(pin) {
    if (pin in rooms) {
      let room = rooms[pin];
      let players = [];
      for (const id of room.players) {
        players.push(clients[id]);
      }
      let reserved = [];
      for (const id of room.reserved) {
        reserved.push(clients[id]);
      }
      socket.emit('room-info', {
        'exists': true,
        'capacity': room.capacity,
        'players': players,
        'reserved': reserved,
        'pin': pin,
        'leader': room.leader,
        'open': room.open,
        'letters': room.letters,
        'guesses': room.guesses
      })
    } else
      socket.emit('room-info', {'exists': false})
  }

  const joinReserved = function (pin) {
    if (pin in rooms) {
      client().pin = pin;
      rooms[pin].reserved.push(uuid());
      getRoomInfoPin(pin);
    } else {
      delete client()['room'];
      socket.emit('notification', {'severity': 'error', 'header': 'Error', 'message': 'An error occurred'})
    }
  }

  const readyUp = function () {
    clients[uuid()].ready = true;
    rooms[client().pin].ready++;
    getRoomInfo();
    if (rooms[client().pin].ready === rooms[client().pin].players.length + rooms[client().pin].reserved.length) {
      rooms[client().pin].open = false;
      rooms[client().pin].gameState = 'waiting'
      getRoomInfoPinSingle(client().pin)
      countdownTimer(5, client().pin, lobbyStartGame)

    }
  }

  const countdownTimer = function (i, pin, callback) {
    setTimeout(function () {
      if (i !== 0) {
        io.to(pin).emit('start-countdown', i);
        i--;
        countdownTimer(i, pin, callback);
      } else
        callback(pin);
    }, 1000);
  }

  function lobbyStartGame(pin) {
    rooms[pin].playersJoining = [...rooms[pin].players];// copy array
    rooms[pin].status = 'waiting';
    io.to(pin).emit('start-game');
  }

  const unreadyUp = function () {
    clients[uuid()].ready = false;
    rooms[client().pin].ready--;
    getRoomInfo();
  }

  const checkLobby = function (pin) {
    if (pin in rooms)
      socket.emit('room-info', {'exists': true, 'pin': pin});
    else
      socket.emit('room-info', {'exists': false});
  };

  const leaveLobby = function (data) {
    if (client().pin in rooms) {
      unreadyUp();
      socket.to(client().pin).emit('notification', {
        'severity': 'info',
        'header': 'Info',
        'message': client().nickname + ' has left the lobby'
      })
      socket.leave(client().pin);
      delete rooms[client().pin].players.splice(rooms[client().pin].players.indexOf(uuid()), 1)

      if (rooms[client().pin].players.length !== 0 && rooms[client().pin].leader === uuid()) {
        rooms[client().pin].leader = rooms[client().pin].players[0]
      }
      getRoomInfoPin(client().pin);
      if (data) {
        delete client().pin
        delete client().nickname
      }
    }
  };
  const leaveReserved = function () {
    socket.leave(client().pin);
    delete rooms[client().pin].reserved.splice(rooms[client().pin].players.indexOf(uuid()), 1)
    getRoomInfoPin(client().pin);
    delete client().pin
    delete client().nickname
  }

  const checkGuessedWord = function (data) {
    checkWord(data.guess, rooms[client().pin].word, rooms[client().pin].letters)
  }

  function checkWord(guess, word, letters) {
    let tempLayout = [].constructor(letters).fill('unused')
    for (let i = 0; i < letters; i++) {
      if (guess.charAt(i) === word.charAt(i)) {
        word = word.substring(0, i) + '*' + word.substring(i + 1);
        guess = guess.substring(0, i) + '*' + guess.substring(i + 1);
        tempLayout[i] = 'correct';
      }
    }
    for (let i = 0; i < letters; i++) {
      if (word.includes(guess.charAt(i)) && word.charAt(i) !== '*' && guess.charAt(i) !== '*') {
        word = word.substring(0, word.indexOf(guess.charAt(i))) + '-' + word.substring(word.indexOf(guess.charAt(i)) + 1);
        tempLayout[i] = 'present'
      }
    }
    return tempLayout;
  }

  const playerWaiting = function () {
    let room = rooms[client().pin];
    if (room === undefined) {
      socket.emit('room-info');
      return
    }
    if (room.playersJoining.includes(uuid())) {
      clients[uuid()].guessResults = Array.from({length: room.guesses}, (_) => Array.from({length: room.letters}, (_) => 'unknown'))
      clients[uuid()].guesses = Array.from({length: room.guesses}, (_) => Array.from({length: room.letters}, (_) => ''))
      clients[uuid()].keyboardResults = Array.from({length: 27}, (_) => 'unknown')
      clients[uuid()].currentGuess = 0
      clients[uuid()].currentGuessChars = 0
      clients[uuid()].guessedWords = []
      clients[uuid()].gameState = 'playing'
      clients[uuid()].startTime = undefined;
      delete room.playersJoining.splice(room.playersJoining.indexOf(uuid()), 1)

    }
    getClientInfo()
    if (room.status === 'waiting' && room.playersJoining.length <= room.players.length - room.players.length / 2) {
      room.status = 'starting';
      room.word = generateWord(room.letters);
      startGame(room.pin)
      room.gameState = 'playing'
      countdownTimer(2, client().pin, startGame)
    } else
      startGame(room.pin)
  }

  const startGame = function (pin) {
    io.to(pin).emit('room-info', rooms[pin])
  }

  const wordEntered = function (keys) {
    let room = rooms[client().pin]
    let guess = client().guesses[client().currentGuess].join("");
    if (guess.length === room.letters
      && (wordlistGuesses[room.letters].includes(guess)
        || wordlistAnswers[room.letters].includes(guess))) {
      if (client().currentGuess === 0) {
        clients[uuid()].startTime = Date.now();
      }
      clients[uuid()].currentGuess++;
      clients[uuid()].currentGuessChars = 0;
      clients[uuid()].guessedWords.push(guess);
      let results = checkWord(guess, room.word, room.letters);
      displayResults(guess, results, keys).then(() => {
        if(guess === room.word) {
          clients[uuid()].gameState = 'won'
          socket.emit('game-won', clients[uuid()].gameState)
        }
        else if(client().currentGuess === room.guesses) {
          clients[uuid()].gameState = 'lost'
          socket.emit('game-lost', clients[uuid()].gameState)
        }
        console.log(results)
        socket.to(client().pin).emit('opponent-guessed-word', client())
      })
    } else socket.emit('invalid-word');
  }
  const displayResults = function (guess, results, keys) {
    return new Promise(function (resolve) {
      (function myLoop(currentGuess, i, end) {
        setTimeout(function() {
          clients[uuid()].guessResults[currentGuess][i] = results[i]
          if (client().keyboardResults[keys.indexOf(guess.charAt(i))] === 'unknown'
            || (client().keyboardResults[keys.indexOf(guess.charAt(i))] === 'present' && results[i] === 'correct')
            || (client().keyboardResults[keys.indexOf(guess.charAt(i))] === 'unused' && (results[i] === 'correct' || results[i] === 'present')))
            clients[uuid()].keyboardResults[keys.indexOf(guess.charAt(i))] = results[i]
          socket.emit('display-results', {
            'client': client(),
            'result': results[i],
            'i': i,
            'keyIndex': keys.indexOf(guess.charAt(i)),
            'keyResult': clients[uuid()].keyboardResults[keys.indexOf(guess.charAt(i))]
          })
          if (i < end) {
            myLoop(currentGuess, i+1, end);
          }
          else
            resolve()
        }, 200)
      })(client().currentGuess - 1, 0, results.length)
    })

  }
  const backspace = function () {
    clients[uuid()].currentGuessChars--;
    clients[uuid()].guesses[clients[uuid()].currentGuess][clients[uuid()].currentGuessChars] = "";
    socket.emit('display-key', {
      'client': client(),
      'guess': clients[uuid()].currentGuess,
      'guessChars': clients[uuid()].currentGuessChars
    })
  }

  const keyEntered = function (data) {
    clients[uuid()].guesses[clients[uuid()].currentGuess][clients[uuid()].currentGuessChars] = data;
    clients[uuid()].currentGuessChars++;
    socket.emit('display-key', {
      'client': client(),
      'guess': clients[uuid()].currentGuess,
      'guessChars': clients[uuid()].currentGuessChars - 1
    })
  }

  function generateWord(letters) {
    return wordlistAnswers[letters][Math.floor(Math.random() * wordlistAnswers[letters].length)];
  }

  socket.on("join-lobby", joinRoom);
  socket.on("get-client-info", getClientInfo);
  socket.on("create-room", createRoom);
  socket.on("get-room-info", getRoomInfo);
  socket.on("get-room-info-pin", getRoomInfoPin);
  socket.on("get-room-info-pin-single", getRoomInfoPinSingle);
  socket.on("leave-lobby", leaveLobby);
  socket.on("check-lobby", checkLobby);
  socket.on("join-reserved", joinReserved);
  socket.on("leave-reserved", leaveReserved);
  socket.on("ready-up", readyUp);
  socket.on("unready-up", unreadyUp);
  socket.on("start-game", playerWaiting);
  socket.on("check-word", checkGuessedWord);
  socket.on("key-entered", keyEntered);
  socket.on("backspace", backspace);
  socket.on("word-entered", wordEntered);

  if (uuid() === ''
    || !(uuid() in clients)
    || client().status === 'connected') {
    socket.handshake.query.uuid = randomUUID();
    clients[uuid()] = {};
    console.log('connected - New:', uuid());
  } else {
    console.log('connected:', uuid());
    if ('pin' in client() && 'nickname' in client())
      joinRoom({'pin': client().pin, 'nickname': client().nickname})
  }
  client().timestamp = Date.now();
  client().status = 'connected';
  client().ready = false;
  client().uuid = uuid();

  socket.conn.on("close", () => {
    console.log('disconnected:', uuid())
    client().status = 'disconnected';
    if ('pin' in client() && client().pin in rooms) {

      if ('players' in rooms[client().pin] && rooms[client().pin].players.includes(uuid()))
        leaveLobby(false);
      else if ('reserved' in rooms[client().pin] && rooms[client().pin].reserved.includes(uuid()))
        leaveReserved();
    }
  });
  io.to(socket.id).emit('set-uuid', {'uuid': uuid()})
}
