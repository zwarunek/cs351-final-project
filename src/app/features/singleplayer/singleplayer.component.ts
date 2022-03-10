import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChildren} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {GoogleTagManagerService} from "angular-google-tag-manager";
import {environment} from "@environment/environment";
import * as confetti from "canvas-confetti";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";

@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.scss']
})
export class SingleplayerComponent implements OnInit {

  private myConfetti: any;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleKeyPress(event.key);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
  }
  @ViewChildren(KeyboardModule) keyboard: any;

  width: any
  height: any;
  gameState: any;
  guesses!: any[];
  guessResults!: any[];
  key: any;
  wordlistAnswers: string[] = [];
  wordlistGuesses: string[] = [];
  letters = 5;
  numberOfGuesses = 6;
  allowedChars!:any[];
  currentGuessChars!: number;
  currentGuess!: number;
  keyboardResults!: any[];
  keyboardKeys!: any[];
  word!: string;
  guessedWords!: any[];
  startTime: any;
  gameStateForInput: any;
  constructor(public http: HttpClient,
              private messageService: MessageService,
              private renderer2: Renderer2,
              private elementRef: ElementRef,
              private gtmService: GoogleTagManagerService,) {
    this.keyboardKeys = [
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
    ];
    this.allowedChars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "enter", "backspace"];

    if(localStorage.getItem('gameState') === null)
      this.initGameBoard();
    else
      this.loadGameBoard();
    http.get('assets/wordlists/5-letter-answers.txt', { responseType: 'text' })
        .subscribe(data => {
          this.wordlistAnswers = data.split(/\r?\n/);
          if(this.word === undefined) {
            this.generateWord()
            this.saveGameState();
          }
        });
    http.get('assets/wordlists/5-letter.txt', { responseType: 'text' })
        .subscribe(data => {
          this.wordlistGuesses = data.split(/\r?\n/);
        });
  }
  loadGameBoard(){
    // @ts-ignore
    let data = JSON.parse(localStorage.getItem('gameState'));
    this.word = data.word;
    this.guessResults = data.guessResults;
    this.guesses = data.guesses;
    this.keyboardResults = data.keyboardResults;
    this.gameStateForInput = data.gameState;
    this.gameState = data.gameState;
    this.currentGuess = data.currentGuess;
    this.currentGuessChars = data.currentGuessChars;
    this.guessedWords = data.guessedWords;
    this.startTime = data.startTime;
    if (environment.env === 'DEV')
      console.log(this.word);

  }
  generateWord(){
    this.word = this.wordlistAnswers[Math.floor(Math.random() * this.wordlistAnswers.length)];
    if (environment.env === 'DEV')
      console.log(this.word);
  }
  initGameBoard(){
    if(this.wordlistAnswers.length !== 0) {
      this.generateWord();
    }
    this.guessResults = Array.from({length: this.numberOfGuesses}, (_) => Array.from({length: this.letters}, (_) => 'unknown'))

    this.guesses = Array.from({length: this.numberOfGuesses}, (_) => Array.from({length: this.letters}, (_) => ''))
    this.keyboardResults = [
      "unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown", "unknown","unknown","unknown","unknown","unknown","unknown","unknown"
    ];
    this.gameState = 'playing';
    this.gameStateForInput = 'playing';
    this.currentGuess = 0;
    this.currentGuessChars = 0;
    this.guessedWords = [];
    this.startTime = undefined;
    this.saveGameState();
  }
  handleKeyPress(key: string){
    this.key = key.toLowerCase();
    if(this.allowedChars.includes(this.key) && this.gameStateForInput === 'playing') {
      let rowElement = document.getElementById('board-row-'+this.currentGuess);

      if (this.key === 'enter') {
        let guess = this.guesses[this.currentGuess].join("");
        if(guess.length == this.letters && (this.wordlistGuesses.includes(guess) || this.wordlistAnswers.includes(guess))) {
          if(this.currentGuess===0){
            this.startTime = Date.now();
          }
          this.currentGuess++;
          this.currentGuessChars = 0;
          this.guessedWords.push(guess);
          let results = this.checkWord(guess, this.word);
          this.displayResults(guess, results);
          if(guess === this.word) {
            this.gameStateForInput = 'won';
            this.gtmService.pushTag({'event': 'game-won',
              'word': this.word,
              'guesses': this.currentGuess,
              'letters': this.letters,
              'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
            setTimeout(() => {
              this.gameState = 'won';
              this.showWin();
            }, 1500)
          }
          else if(this.currentGuess === this.numberOfGuesses) {
            this.gameStateForInput = 'lost';
            this.gtmService.pushTag({'event': 'game-lost',
              'word': this.word,
              'letters': this.letters,
              'time': new Date(Date.now()-this.startTime).toISOString().substr(11, 12)});
            setTimeout(() => {
              this.gameState = 'lost';
            }, 1500)
          }
          else{
            this.saveGameState()
            this.gtmService.pushTag({'event': 'guess',
              'guessed-word': guess,
              'word': this.word,
              'letters': this.letters});
          }
          setTimeout(() => {
            this.saveGameState()
          }, 1200)
        }
        else{
          if(rowElement) {
            rowElement.classList.add('invalid')
            setTimeout(function () {
              if(rowElement)
                rowElement.classList.remove('invalid');
            }, 600);
          }

        }

      }
      else if (this.key === 'backspace') {
        if(this.currentGuessChars > 0){
          this.currentGuessChars --;
          this.guesses[this.currentGuess][this.currentGuessChars]= "";
        }
      }
      else{
        if (this.currentGuessChars < this.letters) {
          this.guesses[this.currentGuess][this.currentGuessChars]= this.key;
          this.currentGuessChars ++;
        }

      }
    }else if(this.gameState !== 'playing'){
      if (this.key === 'enter'){
        this.playAgain();
      }
    }
  }

  ngOnInit(): void {

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const canvas = this.renderer2.createElement('canvas');

    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

    this.myConfetti = confetti.create(canvas, {
      resize: true
    });
  }

  checkWord(guess: string, word:string){

    let tempLayout = ['unused','unused','unused','unused','unused'];
    for(let i = 0; i < this.letters; i++){
      if(guess.charAt(i) === word.charAt(i)){
        word = word.substring(0, i) + '*' + word.substring(i + 1);
        guess = guess.substring(0, i) + '*' + guess.substring(i + 1);
        tempLayout[i] = 'correct';
      }
    }
    for(let i = 0; i < this.letters; i++){
      if(word.includes(guess.charAt(i)) && word.charAt(i) !== '*' && guess.charAt(i) !== '*'){
        word = word.substring(0, word.indexOf(guess.charAt(i))) + '-' + word.substring(word.indexOf(guess.charAt(i)) + 1);
        tempLayout[i] = 'present'
      }
    }
    return tempLayout;
  }

  getDefinition(guess: any) {
    this.http.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + guess).subscribe((data: any) => {
      console.log(data);
      this.messageService.clear();
      this.messageService.add({severity:'custom',key: 'message',  sticky: true, summary: guess.charAt(0).toUpperCase() + guess.slice(1),
        detail: (data[0].meanings[0].partOfSpeech.charAt(0).toUpperCase() + data[0].meanings[0].partOfSpeech.slice(1)).bold()
            +': ' + data[0].meanings[0].definitions[0].definition});
    })
    this.gtmService.pushTag({'event': 'definition', 'word': this.word,});
  }

  playAgain() {
    this.initGameBoard();
    this.gtmService.pushTag({'event': 'play-again'});
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
      this.winConfetti(.5, 1, 90,90);
    }, 200*this.letters)
    let num = Math.round(Math.random())
    setTimeout(() => {
      this.winConfetti(num, 1, num===0?angle1:angle2,num===0?angle1:angle2);
    }, 200*this.letters+200)
    setTimeout(() => {
      this.winConfetti(Math.abs(num-1), 1, Math.abs(num-1)===0?angle1:angle2,Math.abs(num-1)===0?angle1:angle2);
    }, 200*this.letters+400)
  }
  displayResults(guess: any, results: string[]) {
    let i = 0;
    const loop = (currentGuess: number) => {
      setTimeout( () => {
        this.guessResults[currentGuess][i] = results[i]
        if(this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] === 'unknown'
            || (this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] === 'present' && results[i] === 'correct')
            || (this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] === 'unused' && (results[i] === 'correct' || results[i] === 'present')))
          this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = results[i]
        if(i < results.length){
          i++
          loop(currentGuess);
        }
      }, 200)
    };
    loop(this.currentGuess-1);
  }
  getWidth(id: string){
    return document.getElementById(id)?.getBoundingClientRect().width
  }
  getHeight(id: string){
    return document.body.getBoundingClientRect().height-208
  }
  readProperty(name: string): string {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue('--' + name);
  }
  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  winConfetti(x: any, y: any, minAngle: any, maxAngle: any){
    this.fire(0.25, {
      spread: 10,
      startVelocity: 55,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.2, {
      spread: 15,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.35, {
      spread: 20,
      decay: 0.91,
      scalar: 0.8,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.1, {
      spread: 25,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.5, {
      spread: 30,
      startVelocity: 60,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
  }
  fire(particleRatio: number, opts: { spread?: number; startVelocity?: number; decay?: number; scalar?: number; angle?:any; origin?: any}) {
    this.myConfetti({
      colors: [this.readProperty('primary-color'), this.readProperty('secondary-color')],
      angle: this.randomInRange(opts.angle?opts.angle.min:75, opts.angle?opts.angle.max:105),
      particleCount: (200 * particleRatio),
      origin: opts.origin,
      spread: opts.spread,
      startVelocity: opts.startVelocity,
      scalar: opts.scalar,
      decay: opts.decay
    });
  }
  saveGameState(){
    let data = {
      'word': this.word,
      'guessResults': this.guessResults,
      'guesses': this.guesses,
      'keyboardResults': this.keyboardResults,
      'gameState': this.gameStateForInput,
      'currentGuess': this.currentGuess,
      'currentGuessChars': this.currentGuessChars,
      'guessedWords': this.guessedWords,
      'startTime': this.startTime
    }
    localStorage.setItem('gameState', JSON.stringify(data));
  }

}
