import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // private socket: SocketIOClient.Socket;
  // private messages: Array<any>;
  constructor(private socket: Socket) {

  }
  public connect(){
    this.socket.emit('join-room', {
      'username': uuid(),
      'room': 1234
    });

  }
  public getJoined() {
    return this.socket.fromEvent('joined');
  }

  public getMessages (){
    this.socket.emit('new-message-s');
    this.socket.once('message', (message: any) => {
      console.log(message);
    });
  }

  public sendMessage(message: any) {
    // this.socket.on('new-message-s');
  }
}
