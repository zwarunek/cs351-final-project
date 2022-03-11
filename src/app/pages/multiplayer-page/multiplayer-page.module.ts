import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiplayerPageRoutingModule } from './multiplayer-page-routing.module';
import { MultiplayerPageComponent } from './multiplayer-page.component';


@NgModule({
  declarations: [
    MultiplayerPageComponent
  ],
  imports: [
    CommonModule,
    MultiplayerPageRoutingModule
  ]
})
export class MultiplayerPageModule { }
