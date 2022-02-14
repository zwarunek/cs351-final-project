import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordBoardComponent } from './word-board.component';
import {ButtonModule} from "primeng/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";



@NgModule({
  declarations: [
    WordBoardComponent
  ],
  exports: [
    WordBoardComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FontAwesomeModule
  ]
})
export class WordBoardModule { }
