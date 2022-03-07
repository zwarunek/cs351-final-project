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
    this.socket.emit('join-lobby', {
      'nickname': nickname,
      'pin': pin
    });
  }

  public getJoined() {
    return this.socket.fromEvent('joined-room');
  }

  createLobby() {
    this.socket.emit('create-room');
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

  public getRoomInfoPin(pin: any) {
    this.socket.emit('get-room-info-pin', pin.toString());
  }

  public checkRoom(pin: any) {
    this.socket.emit('check-lobby', pin.toString());
  }

  public clientInfo() {
    return this.socket.fromEvent('client-info');
  }

  public getClientInfo() {
    this.socket.emit('get-client-info');
  }

  public leaveLobby(){
    this.socket.emit('leave-lobby', true);
  }

  public notification() {
    return this.socket.fromEvent('notification');
  }
}
