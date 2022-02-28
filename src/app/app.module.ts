import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeadersModule} from "@features/headers/headers.module";
import {MessageService} from "primeng/api";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoModule} from "ngx-socket-io";


@Injectable()
export class GameSocket extends Socket{
  constructor(cookieService: CookieService) {
    // @ts-ignore
    super({  url: 'http://127.0.0.1:5000', options: {query: "uuid=" + cookieService.get('uuid')} });
    this.on('set-uuid',(msg: any)=>{
      cookieService.set('uuid', msg.uuid, new Date(new Date().getTime() + 10*60000))
    });
  }

}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HeadersModule,

  ],
  providers: [MessageService, CookieService,
    {provide: 'googleTagManagerId',  useValue: 'GTM-N6KF3RJ'}, GameSocket
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
