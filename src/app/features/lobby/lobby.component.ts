import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "@core/services/socket.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  playerCap = 6;
  players: any[] = [].constructor(this.playerCap);
  playersInLobby: any[] = [];
  lobbyPin: any;
  roomInfoSub: any;
  playerLeftSub: any;
  clientInfoSub: any;

  constructor(public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {
    this.setPlayers();
    this.roomInfoSub = socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    this.playerLeftSub = socket.playerLeft().subscribe((data: any) => this.playerLeft(data));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.clientInfo(data));
    socket.getRoomInfo()
  }

  ngOnInit(): void {
  }

  setPlayers(){
    this.players = [
      {'name': 'Empty', 'occupied': false},
      {'name': 'Empty', 'occupied': false},
      {'name': 'Empty', 'occupied': false},
      {'name': 'Empty', 'occupied': false},
      {'name': 'Empty', 'occupied': false},
      {'name': 'Empty', 'occupied': false}
    ]
  }

  roomInfo(data: any){
    if(data.exists) {
      this.setPlayers();
      this.lobbyPin = data.pin;
      for (let i = 0; i < data.players.length; i++) {
        this.players[i].name = data.players[i];
        this.players[i].occupied = true;
      }
    }
    else this.backToJoin();
  }

  playerLeft(data: any) {
    this.messageService.add({severity:'info', summary: 'Info', detail: data});
  }

  private clientInfo(data: any) {

  }

  leaveLobby() {
    this.socket.leaveLobby();
    this.backToJoin()
  }

  private backToJoin() {
    this.roomInfoSub.unsubscribe();
    this.playerLeftSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
    this.router.navigate(['/join']);

  }
}
