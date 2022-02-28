import logging
import random
import threading
import time

import mpmath
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
                if time.time() - clientList[key]['timestamp'] > 600 and clientList[key]['status'] == 'disconnected':
                    del clientList[key]

    thread1 = threading.Thread(target=run_job)
    thread1.start()


@socketio.on('connect')
def connect():
    clientuuid = request.args['uuid']
    if clientuuid == '' or clientuuid not in clientList.keys() or clientList[clientuuid]['status'] == 'connected':
        clientuuid = str(uuid.uuid4())
        clientList[clientuuid] = {}
        print('NEW Client connected:', clientuuid)
    else:
        print('Client connected:', clientuuid)
    clientList[clientuuid]['timestamp'] = time.time()
    clientList[clientuuid]['status'] = 'connected'
    clientList[clientuuid]['uuid'] = clientuuid
    session['client'] = clientList[clientuuid]

    emit('set-uuid', {'uuid': clientuuid})

@socketio.on('join-room')
def joinRoom(data):
    if data['room'] in rooms.keys():
        session['client']['room'] = data['room']
        session['client']['nickname'] = data['nickname']
        rooms[data['room']]['players'].append(session['client'])
        join_room(session['client']['room'])
        emit('joined', {'msg': session['client']['nickname'] + ' joined room ' + session['client']['room']}, room=session['client']['room'])
    else:
        emit('room-not-found')


@socketio.on('create-room')
def createRoom(data):
    session['client']['nickname'] = data['nickname']
    pin = random.randint(1111, 9999)
    while pin in rooms.keys():
        pin = random.randint(1111, 9999)
    session['client']['nickname'] = pin
    rooms[pin] = {'players': [session['client']]}
    join_room(pin)
    emit('created-room', {'msg': 'Created lobby with pin ' + str(pin)}, room=pin)


# Read data from client
@socketio.on('get-room-info')
def getRoomInfo():
    socketio.emit('room-data', rooms[session['client']['room']])


# Send data to client
@socketio.on('new-message-s')
def send_data():
    print('sending Data: message: {0}'.format('hello from server'))
    socketio.emit('message', 'hello from server')


@socketio.on('disconnect')
def disconnect():
    # emit('player-left', {'msg': session['client']['nickname'] + ' has left the lobby'}, room=session['client']['room'])
    # rooms[session['client']['room']]['players'].pop(rooms[session['client']['room']]['players'].indexOf(session['client']))
    session['client']['status'] = 'disconnected'
    print('Client disconnected', clientList[session['client']['uuid']])


if __name__ == "__main__":
    testLoop()
    socketio.run(app)
