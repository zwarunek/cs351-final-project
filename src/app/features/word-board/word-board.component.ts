import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-word-board',
  templateUrl: './word-board.component.html',
  styleUrls: ['./word-board.component.scss']
})
export class WordBoardComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.handleKeyPress(event.key);
  }


  gameState: any;
  guesses: any[] = []
  guessResults: any[] = []
  key: any;
  wordlistAnswers: string[] = [];
  wordlistGuesses: string[] = [];
  letters = 5;
  numberOfGuesses = 6;
  allowedChars:any[];
  currentGuessChars = 0
  currentGuess = 0
  keyboardResults: any[];
  keyboardKeys: any[];
  word: string = '';
  guessedWords: any[] = [];
  constructor(public http: HttpClient, private messageService: MessageService) {
    http.get('assets/wordlists/5-letter-answers.txt', { responseType: 'text' })
    .subscribe(data => {
      this.wordlistAnswers = data.split(/\r?\n/);
      this.word = this.wordlistAnswers[Math.floor(Math.random() * this.wordlistAnswers.length)];
      console.log(this.word);
    });
    http.get('assets/wordlists/5-letter.txt', { responseType: 'text' })
    .subscribe(data => {
      this.wordlistGuesses = data.split(/\r?\n/);
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
    this.gameState = 'playing';
  }
  handleKeyPress(key: string){
    this.key = key.toLowerCase();
    if(this.allowedChars.includes(this.key) && this.gameState === 'playing') {
      let rowElement = document.getElementById('board-row-'+this.currentGuess);

      if (this.key === 'enter') {
        let guess = this.guesses[this.currentGuess].join("");
        if(guess.length == this.letters && (this.wordlistGuesses.includes(guess) || this.wordlistAnswers.includes(guess))) {
          this.currentGuess++;
          this.currentGuessChars = 0;
          this.guessedWords.push(guess);
          let results = this.checkWord(guess, this.word);
          this.displayResults(guess, results);
          if(guess === this.word)
            this.gameState = 'won';
          else if(this.currentGuess === this.numberOfGuesses)
            this.gameState = 'lost'
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
    }
  }

  ngOnInit(): void {
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
      this.messageService.clear();
      this.messageService.add({severity:'custom',key: 'message',  sticky: true, summary: guess.charAt(0).toUpperCase() + guess.slice(1),
        detail: (data[0].meanings[0].partOfSpeech.charAt(0).toUpperCase() + data[0].meanings[0].partOfSpeech.slice(1)).bold()
          +': ' + data[0].meanings[0].definitions[0].definition});
    })
  }

  reload() {
    location.reload();
  }

  displayResults(guess: any, results: string[]) {
    let i = 0;
    const loop = () => {
      setTimeout( () => {
        this.guessResults[this.currentGuess-1][i] = results[i]
        this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = results[i]
        if(i < results.length){
          i++
          loop();
        }
      }, 200)
    };
    loop();
  }
}
