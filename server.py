import logging
import threading
import time

from flask import Flask, session, request
from flask_socketio import SocketIO, emit, join_room
import uuid

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
thread = None
clients = 0
log = logging.getLogger('werkzeug')
log.disabled = True
clientList = {}



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
    if clientuuid == '' or clientuuid not in clientList:
        clientuuid = str(uuid.uuid4())
        clientList[clientuuid] = {}
    print('Client connected:', clientuuid)
    clientList[clientuuid]['timestamp'] = time.time()
    clientList[clientuuid]['status'] = 'connected'
    clientList[clientuuid]['uuid'] = clientuuid
    session['client'] = clientList[clientuuid]


@socketio.on('join-room')
def joinRoom(data):
    print('in here')
    # session['room'] = data['room']
    # session['nickname'] = data['nickname']
    #
    # print(session['nickname'])
    # print(session['room'])

    #
    # # emit to the first client that joined the room
    # emit('status', {'msg': session.get('name') + ' has entered the room.'}, room=clientList[0])
    # emit('joined', {'uuid': session['client']['uuid']})


# Read data from client
@socketio.on('new-message')
def handle_message(message):
    print('received message:', message)
    send_data()


# Send data to client
@socketio.on('new-message-s')
def send_data():
    print('sending Data: message: {0}'.format('hello from server'))
    socketio.emit('message', 'hello from server')


@socketio.on('disconnect')
def disconnect():
    session['client']['status'] = 'disconnected'
    print(session['client'])
    print('Client disconnected')


if __name__ == "__main__":
    testLoop()
    app.run()
