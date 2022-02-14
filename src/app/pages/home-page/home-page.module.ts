import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import {HeadersModule} from "@features/headers/headers.module";
import {FootersModule} from "@features/footers/footers.module";
import {WordBoardModule} from "@features/word-board/word-board.module";


@NgModule({
  declarations: [
    HomePageComponent
  ],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    HeadersModule,
    FootersModule,
    WordBoardModule
  ]
})
export class HomePageModule { }
