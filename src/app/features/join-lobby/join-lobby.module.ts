import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JoinLobbyComponent} from './join-lobby.component';
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {FormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {ToastModule} from "primeng/toast";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";


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
    FormsModule,
    InputNumberModule,
    ToastModule,
    MessagesModule,
    MessageModule
  ]
})
export class JoinLobbyModule {
}
