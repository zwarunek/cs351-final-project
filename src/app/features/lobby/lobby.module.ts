import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';



@NgModule({
    declarations: [
        LobbyComponent
    ],
    exports: [
        LobbyComponent
    ],
    imports: [
        CommonModule
    ]
})
export class LobbyModule { }
