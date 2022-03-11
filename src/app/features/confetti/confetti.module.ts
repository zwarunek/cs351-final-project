import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfettiComponent } from './confetti.component';



@NgModule({
    declarations: [
        ConfettiComponent
    ],
    exports: [
        ConfettiComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ConfettiModule { }
