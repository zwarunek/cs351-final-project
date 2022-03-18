import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {GoogleTagManagerService} from "angular-google-tag-manager";

@Component({
  selector: 'app-word-board',
  templateUrl: './word-board.component.html',
  styleUrls: ['./word-board.component.scss']
})
export class WordBoardComponent implements OnInit {

  @Input() numberOfGuesses!: any
  @Input() letters!: any;
  @Input() guesses!: any;
  @Input() currentGuess!: any;
  @Input() guessResults!: any;
  @Input() guessedWords!: any;
  @Input() verticalSpaceNotInUse!: any;

  constructor(public http: HttpClient,
              private messageService: MessageService,
              private gtmService: GoogleTagManagerService,) {

  }

  ngOnInit(): void {
  }

  getWidth(id: string){
    return document.getElementById(id)?.getBoundingClientRect().width
  }
  getHeight(){
    return document.body.getBoundingClientRect().height-this.verticalSpaceNotInUse
  }
  getDefinition(word: any) {
    this.http.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word).subscribe((data: any) => {
      this.messageService.clear();
      this.messageService.add({severity:'custom',key: 'message',  sticky: true, summary: word.charAt(0).toUpperCase() + word.slice(1),
        detail: (data[0].meanings[0].partOfSpeech.charAt(0).toUpperCase() + data[0].meanings[0].partOfSpeech.slice(1)).bold()
            +': ' + data[0].meanings[0].definitions[0].definition});
    })
    this.gtmService.pushTag({'event': 'definition', 'word': word,});
  }
}
