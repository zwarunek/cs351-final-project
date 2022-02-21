import { Component, OnInit } from '@angular/core';
import {SocketService} from "@core/services/socket.service";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit {

  lobbyPinInput: string = '';
  nicknameInput: string = '';

  constructor(public socket: SocketService) { }

  ngOnInit(): void {
    // this.socket.connect();
  }

  createLobby(){

  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
    this.socket.getJoined().subscribe((message: any) => console.log(message))

  }

}
