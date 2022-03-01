import logging
import random
import threading
import time

from flask import Flask, session, request
from flask_socketio import SocketIO, emit, join_room
import uuid

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
thread = None
clients = 0
log = logging.getLogger('werkzeug')
log.disabled = True
clientList = {}
rooms = {}



@app.before_first_request
def testLoop():
    def run_job():
        global clientList
        while True:
            time.sleep(60)
            for key in list(clientList.keys()):
                if time.time() - clientList[key]['timestamp'] > 600 \
                        and clientList[key]['status'] == 'disconnected':
                    del clientList[key]

    thread1 = threading.Thread(target=run_job)
    thread1.start()


@socketio.on('connect')
def connect():
    clientuuid = request.args['uuid']
    session['uuid'] = clientuuid
    if clientuuid == '' \
            or clientuuid not in clientList.keys() \
            or clientList[clientuuid]['status'] == 'connected':
        clientuuid = str(uuid.uuid4())
        clientList[clientuuid] = {}
        session['uuid'] = clientuuid
        print('NEW connected:', clientuuid)
    else:
        print('connected:', clientuuid)
        if 'room' in clientList[session['uuid']].keys():
            join_room(clientList[session['uuid']]['room'])
    clientList[clientuuid]['timestamp'] = time.time()
    clientList[clientuuid]['status'] = 'connected'
    clientList[clientuuid]['uuid'] = clientuuid
    session['uuid'] = clientuuid
    emit('set-uuid', {'uuid': clientuuid})

@socketio.on('join-room')
def joinRoom(data):
    if data['room'] in rooms.keys():
        clientList[session['uuid']]['room'] = data['room']
        clientList[session['uuid']]['nickname'] = data['nickname']
        rooms[data['room']]['players'].append(session['uuid'])
        join_room(data['room'])
        emit('joined-room', {'success': True, 'pin': data['room']}, room=request.sid)
    else:
        emit('joined-room', {'success': False}, room=request.sid)


@socketio.on('create-room')
def createRoom(data):
    clientList[session['uuid']]['nickname'] = data['nickname']
    pin = random.randint(1111, 9999)
    while pin in rooms.keys():
        pin = random.randint(1111, 9999)
    clientList[session['uuid']]['room'] = pin
    rooms[pin] = {'players': []}
    data['room'] = pin
    joinRoom(data)


# Read data from client
@socketio.on('get-room-info')
def getRoomInfo():
    # print(clientList[session['uuid']])
    room = rooms[clientList[session['uuid']]['room']]
    playerList = []
    for id in room['players']:
        playerList.append(clientList[id]['nickname'])
    socketio.emit('room-info', playerList, room=clientList[session['uuid']]['room'])

@socketio.on('disconnect')
def disconnect():
    if 'room' in clientList[session['uuid']].keys():
        emit('player-left', clientList[session['uuid']]['nickname'] + ' has left the lobby', room=clientList[session['uuid']]['room'])

        rooms[clientList[session['uuid']]['room']]['players'].remove(session['uuid'])
        if len(rooms[clientList[session['uuid']]['room']]['players']) == 0:
            del rooms[clientList[session['uuid']]['room']]
        else:
            getRoomInfo()
    clientList[session['uuid']]['status'] = 'disconnected'
    print('disconnected:', session['uuid'])


if __name__ == "__main__":
    testLoop()
    socketio.run(app)
