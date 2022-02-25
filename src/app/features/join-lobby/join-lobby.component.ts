import { Component, OnInit } from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoConfig} from "ngx-socket-io";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {

  lobbyPinInput: string = '';
  nicknameInput: string = '';

  constructor(public socket: SocketService, public cookieService: CookieService) {

  }

  ngOnInit(): void {

  }

  createLobby(){

  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
    let joinedSubscription = this.socket.getJoined().subscribe((message: any) => {
      console.log(message)
      this.cookieService.set('sid', message.sid, new Date(new Date().getTime() + 10*60000))
      joinedSubscription.unsubscribe();
    })
  }

}
