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
  private word: string = '';
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
    if(this.allowedChars.includes(this.key)) {
      let rowElement = document.getElementById('board-row-'+this.currentGuess);

      if (this.key === 'enter' && this.gameState === 'playing') {
        let guess = this.guesses[this.currentGuess].join("");
        if(guess.length == this.letters && (this.wordlistGuesses.includes(guess) || this.wordlistAnswers.includes(guess))) {
          this.currentGuess++;
          this.currentGuessChars = 0;
          this.guessedWords.push(guess);
          this.checkWord(guess, this.word);
          if(guess === this.word){
            this.gameState = 'won';
            this.messageService.clear();
            this.messageService.add({severity:'success', sticky: false, summary: 'You Won!',
              detail:''});
          }
          else if(this.currentGuess === this.numberOfGuesses){
            this.gameState = 'lost'
            this.messageService.clear();
            this.messageService.add({severity:'warn', sticky: true, summary: 'You Lost!',
              detail: 'The word was <b>'+this.word+'</b>'});
          }
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
    let i = 0;
    const myLoop = () => {
      setTimeout(() => {
        if(guess.charAt(i) === word.charAt(i)){
          word = word.substring(0, i) + '*' + word.substring(i + 1)
          this.guessResults[this.currentGuess-1][i] = 'correct'
          this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'correct'
        }
        else if(word.includes(guess.charAt(i)) && word.charAt(i) !== '*'){
          word = word.substring(0, word.indexOf(guess.charAt(i))) + '-' + word.substring(word.indexOf(guess.charAt(i)) + 1)
          this.guessResults[this.currentGuess-1][i] = 'present'
          if(this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] !== 'correct')
            this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'present'
        }
        else if(word.charAt(i) !== '*'){
          this.guessResults[this.currentGuess-1][i] = 'unused'
          if(this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] !== 'correct'
            && this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] !== 'present')
            this.keyboardResults[this.keyboardKeys.indexOf(guess.charAt(i))] = 'unused'
        }
        if (i < this.letters) {
          i++;
          myLoop();
        }
      }, 200)
    }
    myLoop();
  }

  getDefinition(guess: any) {
    this.http.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + guess).subscribe((data: any) => {
      this.messageService.clear();
      this.messageService.add({severity:'custom', sticky: true, summary: guess.charAt(0).toUpperCase() + guess.slice(1),
        detail: (data[0].meanings[0].partOfSpeech.charAt(0).toUpperCase() + data[0].meanings[0].partOfSpeech.slice(1)).bold()
          +': ' + data[0].meanings[0].definitions[0].definition});
    })
  }
}
