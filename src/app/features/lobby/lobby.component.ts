import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "@core/services/socket.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnDestroy, OnInit {

  playerCap = 6;
  players: any[] = [].constructor(this.playerCap);
  lobbyPin: any;
  client: any;
  roomInfoSub: any;
  playerLeftSub: any;
  playerJoinedSub: any;
  clientInfoSub: any;

  constructor(public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {

    this.setPlayers();
    this.roomInfoSub = socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    this.playerLeftSub = socket.playerLeft().subscribe((data: any) => this.playerLeft(data));
    this.playerJoinedSub = socket.playerJoined().subscribe((data: any) => this.playerJoined(data));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.clientInfo(data));
    socket.getClientInfo();
    socket.getRoomInfo();
  }

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.roomInfoSub.unsubscribe();
    this.playerLeftSub.unsubscribe();
    this.playerJoinedSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
  }

  setPlayers(){
    this.players = [
      {'name': 'Empty', 'occupied': false, 'uuid': ''},
      {'name': 'Empty', 'occupied': false, 'uuid': ''},
      {'name': 'Empty', 'occupied': false, 'uuid': ''},
      {'name': 'Empty', 'occupied': false, 'uuid': ''},
      {'name': 'Empty', 'occupied': false, 'uuid': ''},
      {'name': 'Empty', 'occupied': false, 'uuid': ''}
    ]
  }

  roomInfo(data: any){
    this.setPlayers()
    if(data.exists) {
      this.lobbyPin = data.pin;
      for (let i = 0; i < data.players.length; i++) {
        this.players[i].name = data.players[i].nickname;
        this.players[i].uuid = data.players[i].uuid;
        this.players[i].occupied = true;
      }
      let fromIndex = this.players.findIndex((element)=>{return element.uuid === this.client.uuid});
      let element = this.players[fromIndex];
      this.players.splice(fromIndex, 1);
      this.players.splice(0, 0, element)
    }
    else this.backToJoin();
  }

  playerLeft(data: any) {
    this.messageService.add({severity:'info', summary: 'Left', detail: data});
  }

  clientInfo(data: any) {
    this.client = data;
    this.setPlayers();
  }

  leaveLobby() {
    this.socket.leaveLobby();
    this.backToJoin()
  }

  private backToJoin() {
    this.roomInfoSub.unsubscribe();
    this.playerLeftSub.unsubscribe();
    this.playerJoinedSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
    this.router.navigate(['/join']);

  }

  playerJoined(data: any) {
    this.messageService.add({severity:'info', summary: 'Joined', detail: data});
  }
}
