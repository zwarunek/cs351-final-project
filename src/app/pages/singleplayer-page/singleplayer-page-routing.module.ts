import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingleplayerPageComponent} from "@app/pages/singleplayer-page/singleplayer-page.component";

const routes: Routes = [{ path: '', component: SingleplayerPageComponent, data: {title: 'Single-player', description: 'Play Wordle unlimited times per day!'}}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleplayerPageRoutingModule { }
