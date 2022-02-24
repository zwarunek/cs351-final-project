import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MenubarModule} from "primeng/menubar";
import {SharedModule} from "primeng/api";
import {HeaderDefaultComponent} from "@features/headers/header-default/header-default.component";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";

@NgModule({
  declarations: [
    HeaderDefaultComponent
  ],
  exports: [
    HeaderDefaultComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    SharedModule,
    AvatarModule,
    MenuModule,
    ButtonModule,
    RippleModule,
    DialogModule
  ]
})
export class HeadersModule { }
