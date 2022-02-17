import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomePageModule} from "@app/pages/home-page/home-page.module";

const routes: Routes = [

  {
    path: '',
    loadChildren: () => HomePageModule,
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
