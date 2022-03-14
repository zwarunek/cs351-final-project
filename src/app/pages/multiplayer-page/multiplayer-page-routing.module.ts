import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MultiplayerPageComponent} from "@app/pages/multiplayer-page/multiplayer-page.component";

const routes: Routes = [{ path: '', component: MultiplayerPageComponent, data: {title: 'Multiplayer', description: 'Play Wordle with your friends!'}}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiplayerPageRoutingModule { }
