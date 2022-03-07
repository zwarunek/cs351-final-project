import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
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
  getJoinedSub
  getCreatedSub
  notificationSub

  constructor(public socket: SocketService, public route: ActivatedRoute, public cookieService: CookieService, public router: Router, public messageService: MessageService) {

    this.getJoinedSub = this.socket.getJoined().subscribe((data: any) => this.getJoined(data));
    this.getCreatedSub = this.socket.getCreated().subscribe((pin: any) => this.getCreated(pin));
    this.notificationSub = this.socket.notification().subscribe((data: any) => this.notification(data));
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.getJoinedSub.unsubscribe();
    this.getCreatedSub.unsubscribe();
    this.notificationSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      if(data.E === 'NF')
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Lobby not found'});
    });
  }

  createLobby(){
    this.socket.createLobby(this.nicknameInput);
  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput.toString());
  }
  getJoined(data: any){
    if(data.success)
      this.router.navigate(['/lobby']);
  }
  getCreated(pin: number){
    this.socket.joinLobby(this.nicknameInput, pin);
  }
  notification(data: any) {
    this.messageService.add({severity:data.severity, summary: data.header, detail: data.message});
  }
}
