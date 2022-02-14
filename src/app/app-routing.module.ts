import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./pages/home-page/home-page.module').then((m) => m.HomePageModule),
  },
  {path: '**', redirectTo: ''},
  // {
  //   path: '',
  //   loadChildren: () => import('./pages/under-construction-page/under-construction-page.module').then((m) => m.UnderConstructionPageModule),
  // },
  // {path: '**', redirectTo: ''}

];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
