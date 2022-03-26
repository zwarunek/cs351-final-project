import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeadersModule} from "src/app/features/headers/headers.module";
import {ConfirmationService, MessageService} from "primeng/api";
import {CookieService} from "ngx-cookie-service";
import {environment} from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    ProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HeadersModule,

  ],
  providers: [MessageService, CookieService, ConfirmationService,
    {provide: 'googleTagManagerId', useValue: 'GTM-N6KF3RJ'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  environment = environment

  constructor() {
  }
}
