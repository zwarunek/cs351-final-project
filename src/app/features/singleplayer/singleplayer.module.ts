import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleplayerComponent } from './singleplayer.component';
import {ToastModule} from "primeng/toast";
import {KeyboardModule} from "@shared/keyboard/keyboard.module";



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
        KeyboardModule
    ]
})
export class SingleplayerModule { }
