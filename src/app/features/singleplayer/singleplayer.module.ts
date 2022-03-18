import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SingleplayerComponent} from './singleplayer.component';
import {ToastModule} from "primeng/toast";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";
import {WordBoardModule} from "@shared/word-board/word-board.module";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import {ButtonModule} from "primeng/button";
import {ConfettiModule} from "@features/confetti/confetti.module";


@NgModule({
  declarations: [
    SingleplayerComponent
  ],
  exports: [
    SingleplayerComponent
  ],
  imports: [
    CommonModule,
    ToastModule,
    KeyboardModule,
    WordBoardModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    ButtonModule,
    ConfettiModule
  ]
})
export class SingleplayerModule {
}
