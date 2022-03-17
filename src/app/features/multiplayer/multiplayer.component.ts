import {Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environment/environment";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  roomInfoSub: any;
  clientInfoSub: any;
  notificationSub: any;
  gameStartedSub: any;
  letters: any;
  numberOfGuesses: any;
  currentGuess: any;
  currentGuessChars: any;
  guessResults: any;
  guessedWords: any = [];
  guesses: any;
  keyboardResults: any;
  gameStateForInput: any;
  gameState: any;
  word: any;
  startTime: any;
  wordlistAnswers: string[] = [];
  wordlistGuesses: string[] = [];
  @ViewChildren(KeyboardModule) keyboard: any;


  constructor(public http: HttpClient, public ngZone: NgZone, public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {
    this.roomInfoSub = this.socket.roomInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.roomInfo(data)}))
    this.clientInfoSub = this.socket.clientInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.clientInfo(data)}))
    this.notificationSub = socket.notification()
        .subscribe((data: any) => this.ngZone.run(() =>{this.notification(data)}));
    this.gameStartedSub = socket.gameStarted()
        .subscribe((data: any) => this.ngZone.run(() =>{this.gameStarted(data)}));
    this.gameState = 'waiting'
    this.gameStateForInput = 'waiting'
    this.socket.startGame();

  }
  generateWord(){
    this.word = this.wordlistAnswers[Math.floor(Math.random() * this.wordlistAnswers.length)];
    if (environment.env === 'DEV')
      console.log(this.word);
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    this.roomInfoSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
    this.gameStartedSub.unsubscribe();
  }
  ngOnInit(): void {
  }

  notification(data: any) {
    this.messageService.add({severity:data.severity, summary: data.header, detail: data.message});
  }

  private roomInfo(data: any) {
    this.word = data.word;
  }

  private gameStarted(data: any) {
    console.log(data)
    this.word = data.word;
    this.guessResults = data.guessResults;
    this.guesses = data.guesses;
    this.keyboardResults = data.keyboardResults;
    this.gameStateForInput = data.gameState;
    this.gameState = data.gameState;
    this.currentGuess = data.currentGuess;
    this.currentGuessChars = data.currentGuessChars;
    this.guessedWords = data.guessedWords;
    this.startTime = undefined;
    this.letters = data.letters;
    this.numberOfGuesses = data.numberOfGuesses;
    console.log(this.word)
  }

  private clientInfo(data: any) {

  }

  handleKeyPress(key: string){
    key = key.toLowerCase();
  }

}
