from app.main import socketio, app
import app.main as main

if __name__ == "__main__":
    main.testLoop()
    socketio.run(app)
