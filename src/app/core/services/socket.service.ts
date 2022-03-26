import {Injectable, NgZone} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {io} from "socket.io-client";
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
  public socket: any;
  private url = environment.url;

  constructor(public router: Router, public cookieService: CookieService, public messageService: MessageService, private readonly ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.socket = io(this.url, {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 5,
        query: {"uuid": cookieService.get('uuid')}
      });
      this.socket.on('set-uuid', (msg: any) => {
        cookieService.set('uuid', msg.uuid, new Date(new Date().getTime() + 10 * 60000), '/')
      });
    });
  }

  public joinLobby(nickname: any, pin: any) {
    this.socket.emit('join-lobby', {
      'nickname': nickname,
      'pin': pin
    });
  }

  readyUp() {
    this.socket.emit('ready-up');
  }

  unreadyUp() {
    this.socket.emit('unready-up');
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

  public leaveLobby() {
    this.socket.emit('leave-lobby', true);
  }

  public notification(): Observable<any> {
    return fromEvent(this.socket, 'notification');
  }

  public lobbyStartCountdown(): Observable<any> {
    return fromEvent(this.socket, 'start-countdown');
  }

  public gameStarted(): Observable<any> {
    return fromEvent(this.socket, 'start-game');
  }

  joinReserved(pin: any) {
    this.socket.emit('join-reserved', pin.toString());
  }

  ngOnDestroy() {
    this.socket.close();
  }

  leaveReserved() {
    this.socket.emit('leave-reserved');
  }

  startGame() {
    this.socket.emit('start-game');
  }

  wordEntered(keys: any) {
    this.socket.emit('word-entered', keys)
  }

  backspace() {
    this.socket.emit('backspace')
  }

  keyEntered(key: string) {
    this.socket.emit('key-entered', key)
  }

  public displayResults(): Observable<any> {
    return fromEvent(this.socket, 'display-results');
  }

  public displayKey(): Observable<any> {
    return fromEvent(this.socket, 'display-key');
  }

  public invalidWord(): Observable<any> {
    return fromEvent(this.socket, 'invalid-word');
  }

  public gameWon(): Observable<any> {
    return fromEvent(this.socket, 'game-won');
  }

  public gameLost(): Observable<any> {
    return fromEvent(this.socket, 'game-lost');
  }

  public opponentGuessedWord(): Observable<any> {
    return fromEvent(this.socket, 'opponent-guessed-word');
  }

  public timerStopped(): Observable<any> {
    return fromEvent(this.socket, 'timer-stopped');
  }
}
