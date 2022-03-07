import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit, AfterViewInit, OnDestroy {

  lobbyPinInput: any;
  nicknameInput: string = '';
  roomInfoSub
  getCreatedSub
  notificationSub
  clientInfoSub: any;

  constructor(private cdref: ChangeDetectorRef, public socket: SocketService, public route: ActivatedRoute, public cookieService: CookieService, public router: Router, public messageService: MessageService) {

    this.getCreatedSub = this.socket.getCreated().subscribe((pin: any) => this.getCreated(pin));
    this.notificationSub = this.socket.notification().subscribe((data: any) => this.notification(data));
    this.roomInfoSub = this.socket.roomInfo().subscribe((data: any) => this.checkLobby(data));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.clientInfo(data));
    socket.getClientInfo();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.roomInfoSub.unsubscribe();
    this.getCreatedSub.unsubscribe();
    this.notificationSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ('E' in this.route.snapshot.queryParams && this.route.snapshot.queryParams['E'] === 'NF') {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Lobby not found'});
      }
    });
  }

  createLobby(){
    this.socket.createLobby();
  }
  joinLobby(){
    this.socket.checkRoom(this.lobbyPinInput.toString());
  }
  getCreated(pin: any){
    this.router.navigate(['/lobby/' + pin]);
  }
  notification(data: any) {
    this.messageService.add({severity:data.severity, summary: data.header, detail: data.message});
  }

  private checkLobby(data: any) {
    console.log(data.exists, 'hello')
    if(data.exists){
      this.router.navigate(['/lobby/' + data.pin]);
    }
    else{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Lobby not found'});
    }
  }

  clientInfo(data: any) {
    if ('pin' in data){
      this.router.navigate(['/lobby/' + data.pin]);
    }
  }
}
