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
    socket.getJoined(this.onJoin)
  }

  ngOnInit(): void {

  }

  createLobby(){

  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
    // this.socket.getMessages()
    // let joinedSubscription = this.socket.getJoined().subscribe((message: any) => {
    //   console.log(message)
    //   joinedSubscription.unsubscribe();
    // })
  }
  onJoin(){
    console.log('here')
  }
}
