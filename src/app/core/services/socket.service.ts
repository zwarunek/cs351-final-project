import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {map, take} from "rxjs/operators";
import {Observable} from "rxjs";
import { v4 as uuid } from 'uuid';
import {CookieService} from "ngx-cookie-service";
import {GameSocket} from "@app/app.module";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socketIoConfig: any;

  constructor(public cookieService: CookieService, public socket: GameSocket) {
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
