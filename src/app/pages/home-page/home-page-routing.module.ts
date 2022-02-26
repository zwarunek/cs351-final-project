import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "@app/pages/home-page/home-page.component";

const routes: Routes = [{ path: '', component: HomePageComponent, data: {title: 'Single-player', description: 'Play Wordle unlimited times per day!'}}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
