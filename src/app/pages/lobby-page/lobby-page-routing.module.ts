import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LobbyPageComponent} from "@app/pages/lobby-page/lobby-page.component";

const routes: Routes = [{
  path: '',
  component: LobbyPageComponent,
  data: {title: 'Lobby', description: 'Inside multiplayer lobby'}
}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LobbyPageRoutingModule {
}
