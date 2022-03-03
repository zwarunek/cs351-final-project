import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './lobby.component';
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";



@NgModule({
    declarations: [
        LobbyComponent
    ],
    exports: [
        LobbyComponent
    ],
    imports: [
        CommonModule,
        ToastModule,
        ToolbarModule,
        FormsModule,
        InputNumberModule,
        ButtonModule,
        RippleModule
    ]
})
export class LobbyModule { }
