import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JoinLobbyPageComponent} from "@app/pages/join-lobby-page/join-lobby-page.component";

const routes: Routes = [{ path: '', component: JoinLobbyPageComponent, data: {title: 'Join Lobby', description: 'Join or create a multiplayer lobby'}}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinLobbyPageRoutingModule { }
