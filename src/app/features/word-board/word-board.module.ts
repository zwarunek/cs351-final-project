import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordBoardComponent } from './word-board.component';
import {ButtonModule} from "primeng/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ToastModule} from "primeng/toast";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from 'primeng/message';



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
    FontAwesomeModule,
    ToastModule,
    MessagesModule,
    MessageModule
  ]
})
export class WordBoardModule { }
