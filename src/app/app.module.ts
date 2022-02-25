import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeadersModule} from "@features/headers/headers.module";
import {MessageService} from "primeng/api";
import {SocketIoModule} from "ngx-socket-io";
import {CookieService} from "ngx-cookie-service";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule, HeadersModule,
    //@ts-ignore
    // SocketIoModule.forRoot({ url: 'http://127.0.0.1:5000', options: {withCredentials: true} })

  ],
  providers: [MessageService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
