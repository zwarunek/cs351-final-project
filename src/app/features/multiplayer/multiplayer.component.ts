import {Component, NgZone, OnInit, ViewChildren} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environment/environment";
import {KeyboardComponent} from "@shared/keyboard/keyboard.component";

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
  letters = 5;
  numberOfGuesses = 6;
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
  @ViewChildren(KeyboardComponent) allowedChars: any;


  constructor(public http: HttpClient, public ngZone: NgZone, public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {
    this.roomInfoSub = this.socket.roomInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.roomInfo(data)}))
    this.clientInfoSub = this.socket.clientInfo()
        .subscribe((data: any) => this.ngZone.run(() =>{this.clientInfo(data)}))
    this.notificationSub = socket.notification()
        .subscribe((data: any) => this.ngZone.run(() =>{this.notification(data)}));
    this.gameStartedSub = socket.gameStarted()
        .subscribe((data: any) => this.ngZone.run(() =>{this.gameStarted(data)}));
    this.socket.startGame();

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
    console.log(data)
    this.letters = data.letters;
    this.numberOfGuesses = data.guesses;
    this.gameStateForInput = data.gameState;
    this.gameState = data.gameState;
  }

  private gameStarted(data: any) {
    console.log(data)
    this.letters = data.letters;
    this.numberOfGuesses = data.numberOfGuesses;
    this.gameStateForInput = data.gameState;
    this.gameState = data.gameState;
  }

  private clientInfo(data: any) {
    console.log(data)
    this.guessResults = data.guessResults;
    this.guesses = data.guesses;
    this.keyboardResults = data.keyboardResults;
    this.currentGuess = data.currentGuess;
    this.currentGuessChars = data.currentGuessChars;
    this.guessedWords = data.guessedWords;
    this.startTime = undefined;
  }


  handleKeyPress(key: string){
    key = key.toLowerCase();
    if(this.allowedChars.includes(key) && this.gameStateForInput === 'playing') {
      let rowElement = document.getElementById('board-row-'+this.currentGuess);

      if (key === 'enter') {
        // let guess = this.guesses[this.currentGuess].join("");
        // if(guess.length == this.letters && (this.wordlistGuesses.includes(guess) || this.wordlistAnswers.includes(guess))) {
        //   if(this.currentGuess===0){
        //     this.startTime = Date.now();
        //   }
        //   this.currentGuess++;
        //   this.currentGuessChars = 0;
        //   this.guessedWords.push(guess);
        //   let results = this.checkWord(guess, this.word);
        //   this.displayResults(guess, results);
        //   if(guess === this.word) {
        //     this.gameStateForInput = 'won';
        //     this.gtmService.pushTag({'event': 'game-won',
        //       'word': this.word,
        //       'guesses': this.currentGuess,
        //       'letters': this.letters,
        //       'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
        //     setTimeout(() => {
        //       this.gameState = 'won';
        //       this.showWin();
        //     }, 1500)
        //   }
        //   else if(this.currentGuess === this.numberOfGuesses) {
        //     this.gameStateForInput = 'lost';
        //     this.gtmService.pushTag({'event': 'game-lost',
        //       'word': this.word,
        //       'letters': this.letters,
        //       'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
        //     setTimeout(() => {
        //       this.gameState = 'lost';
        //     }, 1500)
        //   }
        //   else{
        //     this.saveGameState()
        //     this.gtmService.pushTag({'event': 'guess',
        //       'guessed-word': guess,
        //       'word': this.word,
        //       'letters': this.letters});
        //   }
        //   setTimeout(() => {
        //     this.saveGameState()
        //   }, 1200)
        // }
        // else{
        //   if(rowElement) {
        //     rowElement.classList.add('invalid')
        //     setTimeout(function () {
        //       if(rowElement)
        //         rowElement.classList.remove('invalid');
        //     }, 600);
        //   }
        //
        // }

      }
      else if (key === 'backspace') {
        if(this.currentGuessChars > 0){
          this.socket.backspace();
        }
      }
      else{
        if (this.currentGuessChars < this.letters) {
          this.socket.keyEntered(key);
        }

      }
    }
  }

}
