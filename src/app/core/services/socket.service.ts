import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  // private messages: Array<any>;
  constructor() {
    const socketIoConfig: SocketIoConfig = {  url: 'http://127.0.0.1:5000', options: {}  };
    this.socket = new Socket(socketIoConfig);
    // this.socket.emit('set-client', {
    //   'uuid': uuid()
    // });
  }

  public joinLobby(nickname: any, pin: any){
    this.socket.emit('join-room', {
      'nickname': nickname,
      'room': pin
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
