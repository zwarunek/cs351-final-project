import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeadersModule} from "@features/headers/headers.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule, HeadersModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
