import { Component, OnInit } from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {Router} from "@angular/router";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {

  lobbyPinInput: any;
  nicknameInput: string = '';

  constructor(public socket: SocketService, public cookieService: CookieService, public router: Router) {
  }

  ngOnInit(): void {

  }

  createLobby(){

  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
    this.router.navigate(['/lobby/' + this.lobbyPinInput]);
  }
}
