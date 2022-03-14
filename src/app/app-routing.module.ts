import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {JoinLobbyPageModule} from "@app/pages/join-lobby-page/join-lobby-page.module";

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./pages/singleplayer-page/singleplayer-page.module')
        .then((m) => m.SingleplayerPageModule),
  },
  {
    path: 'join',
    loadChildren: () => import('./pages/join-lobby-page/join-lobby-page.module')
        .then((m) => m.JoinLobbyPageModule),
  },
  {
    path: 'multiplayer',
    loadChildren: () => import('./pages/multiplayer-page/multiplayer-page.module')
        .then((m) => m.MultiplayerPageModule),
  },
  {
    path: 'lobby/:room',
    loadChildren: () => import('./pages/lobby-page/lobby-page.module')
        .then((m) => m.LobbyPageModule),
  },
  {path: '**', redirectTo: ''}

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
