import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomePageModule} from "@app/pages/home-page/home-page.module";
import {JoinLobbyPageModule} from "@app/pages/join-lobby-page/join-lobby-page.module";

const routes: Routes = [

  {
    path: '',
    loadChildren: () => HomePageModule,
  },
  {
    path: 'join',
    loadChildren: () => JoinLobbyPageModule,
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
