import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-word-board',
  templateUrl: './word-board.component.html',
  styleUrls: ['./word-board.component.scss']
})
export class WordBoardComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key.toLowerCase();
    if(this.allowedChars.includes(this.key)) {

      if (this.key === 'enter') {
        console.log(this.guesses[this.currentGuess].join(""))
        this.checkWord(this.guesses[this.currentGuess].join(""),this.word);
        this.currentGuess ++;
        this.currentGuessChars = 0;

      }
      else if (this.key === 'backspace') {
        this.currentGuessChars --;
        this.guesses[this.currentGuess][this.currentGuessChars]= "";
      }
      else{
        if (this.currentGuessChars < this.letters) {
          this.guesses[this.currentGuess][this.currentGuessChars]= this.key;
          this.currentGuessChars ++;
        }

      }
    }
  }

  gameState: any;
  guesses: any[] = []
  guessResults: any[] = []
  key: any;
  wordlist: string[] = [];
  letters = 5;
  numberOfGuesses = 6;
  allowedChars:any[];
  currentGuessChars = 0
  currentGuess = 0
  keyboardResults: any[];
  keyboardKeys: any[];
  private word: string = '';
  constructor(http: HttpClient) {

    http.get('assets/wordlists/5-letter-answers.txt', { responseType: 'text' })
    .subscribe(data => {
      this.wordlist = data.split(/\r?\n/);
      this.word = this.wordlist[Math.floor(Math.random() * this.wordlist.length)];
      console.log(this.word);
    });
    this.guessResults = [
      ["unknown","unknown","unknown","unknown","unknown"],
      ["unknown","unknown","unknown","unknown","unknown"],
      ["unknown","unknown","unknown","unknown","unknown"],
      ["unknown","unknown","unknown","unknown","unknown"],
      ["unknown","unknown","unknown","unknown","unknown"],
      ["unknown","unknown","unknown","unknown","unknown"],
    ];

    this.guesses = [
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
      ["","","","",""],
    ];
    this.keyboardResults = [
      "unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown","unknown", "unknown","unknown","unknown","unknown","unknown","unknown","unknown"
    ];
    this.keyboardKeys = [
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"
    ];
    this.allowedChars = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m", "enter", "backspace"];
  }

  ngOnInit(): void {
  }

  checkWord(guess: string, word:string){
    for(let i = 0; i < guess.length; i++){
      console.log(guess.charAt(i), word.charAt(i), guess.charAt(i) === word.charAt(i))
      if(guess.charAt(i) === word.charAt(i)){
        word = word.substring(0, i) + '*' + word.substring(i + 1)
        this.guessResults[this.currentGuess][i] = 'correct'
        this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'correct'
      }
    }
    for(let i = 0; i < guess.length; i++){
      if(word.includes(guess.charAt(i)) && word.charAt(i) !== '*'){
        word = word.substring(0, word.indexOf(guess.charAt(i))) + '-' + word.substring(word.indexOf(guess.charAt(i)) + 1)
        this.guessResults[this.currentGuess][i] = 'present'
        if(this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] !== 'correct')
          this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'present'
      }
      else if(word.charAt(i) !== '*'){
        this.guessResults[this.currentGuess][i] = 'unused'
        this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'unused'
      }
    }
    console.log(word)
  }

}
