from app.main import socketio, app
import app.main as main
import logging

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

if __name__ == "__main__":
    main.testLoop()
    socketio.run(app)
