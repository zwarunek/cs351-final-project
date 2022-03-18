import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {GoogleTagManagerService} from "angular-google-tag-manager";
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
  displayResultsSub: any;
  displayKeySub: any;
  invalidWordSub: any;
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
  @ViewChild(KeyboardComponent) keyboard: any;


  constructor(public http: HttpClient,
              public ngZone: NgZone,
              public socket: SocketService,
              public route: ActivatedRoute,
              public messageService: MessageService,
              public router: Router,
              public gtmService: GoogleTagManagerService) {
    this.roomInfoSub = this.socket.roomInfo()
      .subscribe((data: any) => this.ngZone.run(() => {
        this.roomInfo(data)
      }))
    this.clientInfoSub = this.socket.clientInfo()
      .subscribe((data: any) => this.ngZone.run(() => {
        this.clientInfo(data)
      }))
    this.notificationSub = socket.notification()
      .subscribe((data: any) => this.ngZone.run(() => {
        this.notification(data)
      }));
    this.displayResultsSub = socket.displayResults()
      .subscribe((data: any) => this.ngZone.run(() => {
        this.displayResults(data)
      }));
    this.displayKeySub = socket.displayKey()
      .subscribe((data: any) => this.ngZone.run(() => {
        this.displayKey(data)
      }));
    this.invalidWordSub = socket.invalidWord()
      .subscribe(() => this.ngZone.run(() => {
        this.invalidWord()
      }));
    this.socket.startGame();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  ngOnInit(): void {
  }

  notification(data: any) {
    this.messageService.add({severity: data.severity, summary: data.header, detail: data.message});
  }

  handleKeyPress(key: string) {
    if (this.gameStateForInput === 'playing') {
      let rowElement = document.getElementById('board-row-' + this.currentGuess);

      if (key === 'enter') {
        // let guess = this.guesses[this.currentGuess].join("");
        // if (guess.length == this.letters
        //     && (this.wordlistGuesses.includes(guess)
        //     || this.wordlistAnswers.includes(guess))) {
          this.socket.wordEntered(this.keyboard.keyboardKeys)
        //   if (this.currentGuess === 0) {
        //     this.startTime = Date.now();
        //   }
        //   this.currentGuess++;
        //   this.currentGuessChars = 0;
        //   this.guessedWords.push(guess);
        //   let results = this.checkWord(guess, this.word);
        //   this.displayResults(guess, results);
        //   if (guess === this.word) {
        //     this.gameStateForInput = 'won';
        //     this.gtmService.pushTag({
        //       'event': 'game-won',
        //       'word': this.word,
        //       'guesses': this.currentGuess,
        //       'letters': this.letters,
        //       'time': new Date(Date.now() - this.startTime).toISOString().substr(11, 12)
        //     });
        //     setTimeout(() => {
        //       this.gameState = 'won';
        //       this.showWin();
        //     }, 1500)
        //   } else if (this.currentGuess === this.numberOfGuesses) {
        //     this.gameStateForInput = 'lost';
        //     this.gtmService.pushTag({
        //       'event': 'game-lost',
        //       'word': this.word,
        //       'letters': this.letters,
        //       'time': new Date(Date.now() - this.startTime).toISOString().substr(11, 12)
        //     });
        //     setTimeout(() => {
        //       this.gameState = 'lost';
        //     }, 1500)
        //   } else {
        //     this.saveGameState()
        //     this.gtmService.pushTag({
        //       'event': 'guess',
        //       'guessed-word': guess,
        //       'word': this.word,
        //       'letters': this.letters
        //     });
        //   }
        //   setTimeout(() => {
        //     this.saveGameState()
        //   }, 1200)
        // } else if (rowElement) {
        //   rowElement.classList.add('invalid')
        //   setTimeout(function () {
        //     if (rowElement)
        //       rowElement.classList.remove('invalid');
        //   }, 600);
        // }
      } else if (key === 'backspace') {
        if (this.currentGuessChars > 0) {
          this.socket.backspace();
        }
      }
      else {
        if (this.currentGuessChars < this.letters) {
          this.socket.keyEntered(key);
        }

      }
    }
  }

  displayResults(data: any) {
    this.startTime = data.client.startTime;
    this.currentGuess = data.client.currentGuess
    this.currentGuessChars = data.client.currentGuessChars
    this.guessedWords = data.client.guessedWords
    this.guessResults[this.currentGuess - 1][data.i] = data.result;
    this.keyboardResults[data.keyIndex] = data.keyResult;
  }

  private unsubscribeAll() {
    this.roomInfoSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
    this.displayResultsSub.unsubscribe();
    this.displayKeySub.unsubscribe();
    this.invalidWordSub.unsubscribe();
  }

  private roomInfo(data: any) {
    if(data === undefined){
      this.unsubscribeAll()
      this.router.navigate(['/join']);
    }
    else {
      this.letters = data.letters;
      this.numberOfGuesses = data.guesses;
      this.gameStateForInput = data.gameState;
      this.gameState = data.gameState;
    }
  }

  private clientInfo(data: any) {
    console.log(data);
    this.guessResults = JSON.parse(JSON.stringify(data.guessResults))
    this.guesses = data.guesses;
    this.keyboardResults = data.keyboardResults;
    this.currentGuess = data.currentGuess;
    this.currentGuessChars = data.currentGuessChars;
    this.guessedWords = data.guessedWords;
    this.startTime = data.startTime;
  }

  private displayKey(data: any) {
    this.startTime = data.client.startTime;
    this.currentGuess = data.client.currentGuess
    this.currentGuessChars = data.client.currentGuessChars
    this.guessedWords = data.client.guessedWords
    this.guesses[data.guess][data.guessChars] = data.client.guesses[data.guess][data.guessChars]
    this.currentGuessChars = data.client.currentGuessChars;
  }

  private invalidWord() {
    let rowElement = document.getElementById('board-row-'+this.currentGuess);

    if (rowElement) {
      rowElement.classList.add('invalid')
      setTimeout(function () {
        if (rowElement)
          rowElement.classList.remove('invalid');
      }, 600);
    }
  }
}
