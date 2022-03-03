import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyPageRoutingModule } from './lobby-page-routing.module';
import { LobbyPageComponent } from './lobby-page.component';
import {LobbyModule} from "@features/lobby/lobby.module";
import {HeadersModule} from "@features/headers/headers.module";


@NgModule({
  declarations: [
    LobbyPageComponent
  ],
    imports: [
        CommonModule,
        LobbyPageRoutingModule,
        LobbyModule,
        HeadersModule
    ]
})
export class LobbyPageModule { }
