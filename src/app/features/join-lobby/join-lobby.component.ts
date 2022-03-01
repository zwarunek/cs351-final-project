import { Component, OnInit } from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {

  lobbyPinInput: any;
  nicknameInput: string = '';

  constructor(public socket: SocketService, public cookieService: CookieService, public router: Router, public messageService: MessageService) {

    this.socket.getJoined().subscribe((success: any) => this.getJoined(success));
    socket.getCreated().subscribe((pin: any) => this.getCreated(pin));
  }

  ngOnInit(): void {

  }

  createLobby(){
    console.log('asdfsadf')
    this.socket.createLobby(this.nicknameInput);
  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
  }
  getJoined(data: any){
    if(data.success)
      this.router.navigate(['/lobby/' + data.pin]);
    else
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Lobby not found'});
  }
  getCreated(pin: number){
    this.socket.joinLobby(this.nicknameInput, pin);
  }
}
