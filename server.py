
import logging
import sys

import flask
from flask import Flask, jsonify, render_template, jsonify, Response, session, request
from flask_restful import Resource, Api, marshal_with
from flask_socketio import SocketIO, emit, send, join_room
from threading import Thread
import time

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')
thread = None
clients = 0
log = logging.getLogger('werkzeug')
log.disabled = True
clientList = {}


@socketio.on('connect')
def connect():
    print('Session ID:', request.sid, request.args['sessionid'])
    session['sid'] = request.sid


@socketio.on('set-client')
def connect(data):
    clientList[data['uuid']] = {}
    session['uuid'] = data['uuid']
    # session['uuid'] = data['uuid']
    # emit('connected', {'msg': session['uuid']}, room=session['room'])


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
def test_disconnect():
    global clients
    clients -= 1
    print('Client disconnected')




if __name__ == "__main__":
    print("starting webservice")
