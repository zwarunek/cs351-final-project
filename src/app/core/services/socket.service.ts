import {Injectable, NgZone} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import { io } from "socket.io-client";
import {MessageService} from "primeng/api";
import {environment} from "@environment/environment";
import {Router} from "@angular/router";
import {fromEvent, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socketIoConfig: any;

  observer: any;
  observer2: any;
  private url = environment.url;
  private socket: any;
  constructor(public router: Router, public cookieService: CookieService, public messageService: MessageService,private readonly ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.socket = io(this.url, {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 5,
        query: {"uuid": cookieService.get('uuid')}
      });
      this.socket.on('set-uuid',(msg: any)=>{
        cookieService.set('uuid', msg.uuid, new Date(new Date().getTime() + 10*60000), '/')
      });
    });
  }

  public joinLobby(nickname: any, pin: any){
    this.socket.emit('join-lobby', {
      'nickname': nickname,
      'pin': pin
    });
  }

  public getJoined(): Observable<any> {
    return fromEvent(this.socket, 'joined-room');
  }

  createLobby() {
    this.socket.emit('create-room');
  }

  public getCreated(): Observable<any> {
    return fromEvent(this.socket, 'created-room');
  }

  public roomInfo(): Observable<any> {
    return fromEvent(this.socket, 'room-info');
  }

  public getRoomInfo() {
    this.socket.emit('get-room-info');
  }

  public getRoomInfoPin(pin: any) {
    this.socket.emit('get-room-info-pin', pin.toString());
  }

  public getRoomInfoPinSingle(pin: any) {
    this.socket.emit('get-room-info-pin-single', pin.toString());
  }

  public checkRoom(pin: any) {
    this.socket.emit('check-lobby', pin.toString());
  }

  public clientInfo(): Observable<any> {
    return fromEvent(this.socket, 'client-info');
  }

  public getClientInfo() {
    this.socket.emit('get-client-info');
  }

  public leaveLobby(){
    this.socket.emit('leave-lobby', true);
  }

  public notification(): Observable<any> {
    return fromEvent(this.socket, 'notification');
  }

  joinReserved(pin: any) {
    this.socket.emit('join-reserved', pin.toString());
  }
  ngOnDestroy() {
    this.socket.close();
  }
}
