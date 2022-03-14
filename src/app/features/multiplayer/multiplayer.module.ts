import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiplayerComponent } from './multiplayer.component';
import {ToastModule} from "primeng/toast";
import {WordBoardModule} from "@shared/word-board/word-board.module";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";



@NgModule({
    declarations: [
        MultiplayerComponent
    ],
    exports: [
        MultiplayerComponent
    ],
    imports: [
        CommonModule,
        ToastModule,
        WordBoardModule,
        KeyboardModule
    ]
})
export class MultiplayerModule { }
