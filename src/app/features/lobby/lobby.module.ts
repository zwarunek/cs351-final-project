import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import {ToastModule} from "primeng/toast";



@NgModule({
    declarations: [
        LobbyComponent
    ],
    exports: [
        LobbyComponent
    ],
    imports: [
        CommonModule,
        ToastModule
    ]
})
export class LobbyModule { }
