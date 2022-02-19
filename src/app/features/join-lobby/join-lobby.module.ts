import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinLobbyComponent } from './join-lobby.component';



@NgModule({
  declarations: [
    JoinLobbyComponent
  ],
  exports: [
    JoinLobbyComponent
  ],
  imports: [
    CommonModule
  ]
})
export class JoinLobbyModule { }
