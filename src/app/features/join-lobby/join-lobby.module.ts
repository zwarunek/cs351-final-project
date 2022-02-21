import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinLobbyComponent } from './join-lobby.component';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    JoinLobbyComponent
  ],
  exports: [
    JoinLobbyComponent
  ],
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    FormsModule
  ]
})
export class JoinLobbyModule { }
