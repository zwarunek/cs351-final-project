import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SingleplayerPageRoutingModule} from './singleplayer-page-routing.module';
import {SingleplayerPageComponent} from './singleplayer-page.component';
import {HeadersModule} from "@features/headers/headers.module";
import {SingleplayerModule} from "@features/singleplayer/singleplayer.module";


@NgModule({
  declarations: [
    SingleplayerPageComponent
  ],
  imports: [
    CommonModule,
    SingleplayerPageRoutingModule,
    HeadersModule,
    SingleplayerModule
  ]
})
export class SingleplayerPageModule {
}
