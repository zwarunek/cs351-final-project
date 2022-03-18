import {Component, HostListener, NgZone, OnInit, ViewChild} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {GoogleTagManagerService} from "angular-google-tag-manager";
import {KeyboardComponent} from "@shared/keyboard/keyboard.component";
import {ConfettiComponent} from "@features/confetti/confetti.component";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.scss']
})
export class MultiplayerComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
  }
  width: any
  height: any;
  roomInfoSub: any;
  clientInfoSub: any;
  notificationSub: any;
  displayResultsSub: any;
  displayKeySub: any;
  invalidWordSub: any;
  gameWonSub: any;
  gameLostSub: any;
  opponentGuessedWordSub: any;
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
  roomState: any;
  word: any;
  startTime: any;
  players: any[] = [];
  @ViewChild(KeyboardComponent) keyboard: any;
  @ViewChild(ConfettiComponent) confettiComponent: any;


  constructor(public http: HttpClient,
              public ngZone: NgZone,
              public socket: SocketService,
              public route: ActivatedRoute,
              public messageService: MessageService,
              public router: Router,
              public gtmService: GoogleTagManagerService) {
    this.socket.socket.once('room-info',(data: any) =>{
      this.players = data.players;
      console.log('GOT THE PLAYERS', data.players)
    });
    this.socket.getRoomInfo();
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
    this.gameWonSub = socket.gameWon()
        .subscribe((data: any) => this.ngZone.run(() => {
          this.gameWon(data)
        }));
    this.gameLostSub = socket.gameLost()
        .subscribe((data: any) => this.ngZone.run(() => {
          this.gameLost(data)
        }));
    this.opponentGuessedWordSub = socket.opponentGuessedWord()
        .subscribe((data: any) => this.ngZone.run(() => {
          this.opponentGuessedWord(data)
        }));
    this.socket.startGame();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
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
    this.startTime = data.gameInfo.startTime;
    this.currentGuess = data.gameInfo.currentGuess
    this.currentGuessChars = data.gameInfo.currentGuessChars
    this.guessedWords = data.gameInfo.guessedWords
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
    this.gameWonSub.unsubscribe();
    this.gameLostSub.unsubscribe();
    this.opponentGuessedWordSub.unsubscribe();
  }

  private roomInfo(data: any) {
    console.log(data);
    if(data === undefined){
      this.unsubscribeAll()
      this.router.navigate(['/join']);
    }
    else {
      this.letters = data.letters;
      this.numberOfGuesses = data.guesses;
      this.roomState = data.gameState;
    }
  }

  private clientInfo(data: any) {
    for(let i = 0; i < this.players.length; i++)
      if(this.players[i].uuid === data.uuid)
        this.players.splice(i, 1)
    this.guessResults = JSON.parse(JSON.stringify(data.gameInfo.guessResults))
    this.guesses = data.gameInfo.guesses;
    this.keyboardResults = data.gameInfo.keyboardResults;
    this.currentGuess = data.gameInfo.currentGuess;
    this.currentGuessChars = data.gameInfo.currentGuessChars;
    this.guessedWords = data.gameInfo.guessedWords;
    this.startTime = data.gameInfo.startTime;
    this.gameStateForInput = data.gameInfo.gameState;
    this.gameState = data.gameInfo.gameState;
  }

  private displayKey(data: any) {
    this.startTime = data.client.gameInfo.startTime;
    this.currentGuess = data.client.gameInfo.currentGuess
    this.currentGuessChars = data.client.gameInfo.currentGuessChars
    this.guessedWords = data.client.gameInfo.guessedWords
    this.guesses[data.guess][data.guessChars] = data.client.gameInfo.guesses[data.guess][data.guessChars]
    this.currentGuessChars = data.client.gameInfo.currentGuessChars;
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

  gameWon(data: any){
    this.gameStateForInput = data;
    this.gtmService.pushTag({'event': 'game-won',
      'word': this.word,
      'guesses': this.currentGuess,
      'letters': this.letters,
      'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
    setTimeout(() =>{
      this.gameState = data;
      this.showWin();
    }, 500)
  }

  gameLost(data: any){
    this.gameStateForInput = data;
    this.gtmService.pushTag({'event': 'game-lost',
      'word': this.word,
      'letters': this.letters,
      'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
    setTimeout(() => {
      this.gameState = data;
    })
  }

  showWin(){
    let i = 0;
    const loop = () => {
      setTimeout( () => {
        // @ts-ignore
        document.getElementById('board-tile-'+(this.currentGuess-1)+'-'+i).classList.add('game-won');
        i++
        if(i < this.letters){
          loop();
        }
      }, 100)
    };
    loop();
    let angle1 = Math.atan2(this.height, this.width/2)*180/Math.PI;
    let angle2 = 90 + 90-angle1;
    setTimeout(() => {
      this.confettiComponent.winConfetti(.5, 1, 90,90);
    }, 200*this.letters)
    let num = Math.round(Math.random())
    setTimeout(() => {
      this.confettiComponent.winConfetti(num, 1, num===0?angle1:angle2,num===0?angle1:angle2);
    }, 200*this.letters+200)
    setTimeout(() => {
      this.confettiComponent.winConfetti(Math.abs(num-1), 1, Math.abs(num-1)===0?angle1:angle2,Math.abs(num-1)===0?angle1:angle2);
    }, 200*this.letters+400)
  }

  opponentGuessedWord(data: any) {
    data.gameInfo.guessResults = data.gameInfo.guessResults.filter((v:any) => v !== null);

    for(let i = 0; i < data.gameInfo.guessResults.length; i++){
      if(data.gameInfo.guessResults[i].length > this.letters)
        data.gameInfo.guessResults[i].pop();
    }
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].uuid === data.uuid)
        this.players[i] = data;
    }
    console.log(data, this.players)
  }
}
