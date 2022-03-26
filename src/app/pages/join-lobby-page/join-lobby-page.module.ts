import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JoinLobbyPageRoutingModule} from './join-lobby-page-routing.module';
import {JoinLobbyPageComponent} from './join-lobby-page.component';
import {HeadersModule} from "@features/headers/headers.module";
import {JoinLobbyModule} from "@features/join-lobby/join-lobby.module";


@NgModule({
  declarations: [
    JoinLobbyPageComponent
  ],
  imports: [
    CommonModule,
    JoinLobbyPageRoutingModule,
    HeadersModule,
    JoinLobbyModule
  ]
})
export class JoinLobbyPageModule {
}
