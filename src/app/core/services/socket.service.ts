import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {GameSocket} from "@app/app.module";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socketIoConfig: any;

  constructor(public cookieService: CookieService, public socket: GameSocket, public messageService: MessageService) {
  }

  public joinLobby(nickname: any, pin: any){
    this.socket.emit('join-room', {
      'nickname': nickname,
      'room': pin
    });
  }

  public getJoined() {
    return this.socket.fromEvent('joined-room');
  }

  createLobby(nickname: string) {
    this.socket.emit('create-room', {
      'nickname': nickname
    });
  }

  public getCreated() {
    return this.socket.fromEvent('created-room');
  }

  public roomInfo() {
    return this.socket.fromEvent('room-info');
  }

  public getRoomInfo() {
    this.socket.emit('get-room-info');
  }

  public playerLeft() {
    return this.socket.fromEvent('player-left');
  }
}
