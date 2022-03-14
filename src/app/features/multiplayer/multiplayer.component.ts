import {Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  roomInfoSub: any;
  clientInfoSub: any;
  notificationSub: any;
  letters = 5;
  numberOfGuesses = 6;
  currentGuess: any;
  guessResults: any;
  guessedWords: any;
  guesses: any;
  keyboardResults: any;
  gameState: any;
  word: any;
  @ViewChildren(KeyboardModule) keyboard: any;


  constructor(public ngZone: NgZone, public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {
    this.roomInfoSub = this.socket.roomInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.roomInfo(data)}))
    this.roomInfoSub = this.socket.clientInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.clientInfo(data)}))
    this.notificationSub = socket.notification()
        .subscribe((data: any) => this.ngZone.run(() =>{this.notification(data)}));
    this.socket.startGame();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    this.roomInfoSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
  }
  ngOnInit(): void {
  }

  notification(data: any) {
    this.messageService.add({severity:data.severity, summary: data.header, detail: data.message});
  }

  private roomInfo(data: any) {
    this.word = data.word
  }

  private clientInfo(data: any) {

  }

  handleKeyPress(key: string){
    key = key.toLowerCase();
  }

}
