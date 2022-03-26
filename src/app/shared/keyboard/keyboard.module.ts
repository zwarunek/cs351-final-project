import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeyboardComponent} from './keyboard.component';
import {ButtonModule} from "primeng/button";


@NgModule({
  declarations: [
    KeyboardComponent
  ],
  exports: [
    KeyboardComponent
  ],
  imports: [
    CommonModule,
    ButtonModule
  ]
})
export class KeyboardModule {
}
