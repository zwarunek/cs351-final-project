import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {JoinLobbyPageComponent} from "@app/pages/join-lobby-page/join-lobby-page.component";

const routes: Routes = [{ path: '', component: JoinLobbyPageComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinLobbyPageRoutingModule { }
