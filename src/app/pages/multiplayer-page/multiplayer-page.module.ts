import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiplayerPageRoutingModule } from './multiplayer-page-routing.module';
import { MultiplayerPageComponent } from './multiplayer-page.component';
import {HeadersModule} from "@features/headers/headers.module";
import {MultiplayerModule} from "@features/multiplayer/multiplayer.module";


@NgModule({
  declarations: [
    MultiplayerPageComponent
  ],
    imports: [
        CommonModule,
        MultiplayerPageRoutingModule,
        HeadersModule,
        MultiplayerModule
    ]
})
export class MultiplayerPageModule { }
