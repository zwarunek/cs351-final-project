import { Component, OnInit } from '@angular/core';
import {faFilm} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-word-board',
  templateUrl: './word-board.component.html',
  styleUrls: ['./word-board.component.scss']
})
export class WordBoardComponent implements OnInit {
  filmIcon = faFilm;
  letters = 5;
  guesses = 6;

  constructor() { }

  ngOnInit(): void {
  }

}
