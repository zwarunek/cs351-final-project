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
  notificationSub: any;
  clientInfoSub: any;
  checkRoomSub: any;
  displayBasic = false;
  displayLobby = false;
  nickname: any;

  constructor(public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService, public router: Router) {

    this.setPlayers();
    this.roomInfoSub = socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    this.notificationSub = socket.notification().subscribe((data: any) => this.notification(data));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.clientInfo(data));
    this.lobbyPin = this.route.snapshot.paramMap.get('room');
    socket.getClientInfo();
    this.socket.getRoomInfoPin(this.lobbyPin);
    // socket.getRoomInfo();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.roomInfoSub.unsubscribe();
    this.notificationSub.unsubscribe();
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
    console.log('inside room info', data);
    if(data.exists) {
      this.setPlayers()
      for (let i = 0; i < data.players.length; i++) {
        this.players[i].name = data.players[i].nickname;
        this.players[i].uuid = data.players[i].uuid;
        this.players[i].occupied = true;
        this.players[i].leader = data.leader === data.players[i].uuid;
      }
      let fromIndex = this.players.findIndex((element)=>{return element.uuid === this.client.uuid});
      let element = this.players[fromIndex];
      this.players.splice(fromIndex, 1);
      this.players.splice(0, 0, element);
      this.displayLobby = true;
      this.displayBasic = false;
    }
    else this.backToJoin({'E': 'NF'});
  }

  clientInfo(data: any) {
    this.client = data;
    console.log(data, 'nickname' in this.client)
    if(!('pin' in this.client) || this.client.pin === this.lobbyPin) {
      if ('nickname' in this.client) {
        // this.socket.joinLobby(this.client.nickname, this.client.pin)
        this.socket.getRoomInfo();
      } else {
        this.displayBasic = true;
      }
    }
    else{
      this.router.navigate(['/lobby/' + this.client.pin])
          .then(() => {
            window.location.reload();
          });
    }
    // this.setPlayers();
  }

  leaveLobby() {
    this.socket.leaveLobby();
    this.backToJoin({})
  }

  private backToJoin(params: any) {
    this.roomInfoSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
    this.router.navigate(['/join'], {queryParams: params});

  }

  notification(data: any) {
    this.messageService.add({severity:data.severity, summary: data.header, detail: data.message});
  }

  joinLobby() {
    this.socket.joinLobby(this.nickname, this.lobbyPin);
  }
}
