import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterDefaultComponent} from "@features/footers/footer-default/footer-default.component";



@NgModule({
  declarations: [
    FooterDefaultComponent
  ],
  exports: [
    FooterDefaultComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FootersModule { }
