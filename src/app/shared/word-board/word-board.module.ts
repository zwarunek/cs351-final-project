import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordBoardComponent } from './word-board.component';



@NgModule({
    declarations: [
        WordBoardComponent
    ],
    exports: [
        WordBoardComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WordBoardModule { }
