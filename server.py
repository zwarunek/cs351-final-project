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
            time.sleep(3)
            print("looking for clients to delete...", time.time())
            for key in list(clientList.keys()):
                print(time.time() - clientList[key]['timestamp'])
                if time.time() - clientList[key]['timestamp'] > 600 and clientList[key]['status'] == 'disconnected':
                    print('deleting', key)
                    del clientList[key]
            print(clientList)

    thread1 = threading.Thread(target=run_job)
    thread1.start()


@socketio.on('connect')
def connect():
    clientuuid = request.args['uuid']
    if clientuuid == '' or clientuuid not in clientList:
        clientuuid = str(uuid.uuid4())
        clientList[clientuuid] = {}
        print('new user uuid:', clientuuid)
    clientList[clientuuid]['timestamp'] = time.time()
    clientList[clientuuid]['status'] = 'connected'
    clientList[clientuuid]['uuid'] = clientuuid
    session['client'] = clientList[clientuuid]
    emit('set-uuid', {'uuid': clientuuid})


@socketio.on('join-room')
def joinRoom(data):
    session['room'] = data['room']
    session['nickname'] = data['nickname']

    global clients
    clients += 1
    print(session['nickname'])
    print(session['room'])
    join_room(session['room'])

    #
    # # emit to the first client that joined the room
    # emit('status', {'msg': session.get('name') + ' has entered the room.'}, room=clientList[0])
    emit('joined', {'sid': session['sid']}, room=session['room'])


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
