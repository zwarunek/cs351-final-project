import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SocketService} from "@core/services/socket.service";
import {MessageService} from "primeng/api";
import {first, take} from "rxjs/operators";

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

    this.notificationSub = socket.notification().subscribe((data: any) => this.notification(data));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.clientInfo(data));
    this.lobbyPin = this.route.snapshot.paramMap.get('room');
    this.socket.roomInfo().subscribe((data: any) => this.initialRoomCheck(data))
    this.socket.getClientInfo();
    this.socket.getRoomInfoPinSingle(this.lobbyPin);
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
      {'name': 'Empty', 'status': 'empty', 'uuid': ''},
      {'name': 'Empty', 'status': 'empty', 'uuid': ''},
      {'name': 'Empty', 'status': 'empty', 'uuid': ''},
      {'name': 'Empty', 'status': 'empty', 'uuid': ''},
      {'name': 'Empty', 'status': 'empty', 'uuid': ''},
      {'name': 'Empty', 'status': 'empty', 'uuid': ''}
    ]
  }

  roomInfo(data: any){
    console.log('inside room info', data);
    if(data.exists) {
      this.setPlayers()
      let room = data.room;
      for (let i = 0; i < room.players.length; i++) {
        this.players[i].name = room.players[i].nickname;
        this.players[i].uuid = room.players[i].uuid;
        this.players[i].status = 'occupied';
        this.players[i].leader = room.leader === room.players[i].uuid;
      }
      for (let i = room.players.length; i < room.reserved.length; i++) {
        this.players[i].name = 'Joining...';
        this.players[i].status = 'reserved';
        this.players[i].leader = false;
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

  initialRoomCheck(data: any) {
    console.log('initial room check')
    this.roomInfoSub = this.socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    if(data.exists){
      let room = data.room;
      if(room.capacity < room.players.length){
        if(!('pin' in this.client) || this.client.pin === this.lobbyPin) {
          if ('nickname' in this.client) {
            this.roomInfo(data);
          } else {
            this.socket.joinReserved(this.lobbyPin);
            this.displayBasic = true;
          }
        }
        else{
          this.router.navigate(['/lobby/' + this.client.pin])
              .then(() => {
                window.location.reload();
              });
        }
      }
      else{
        this.backToJoin({'E': 'CAP'});
      }

    }
    else this.backToJoin({'E': 'NF'});
  }
}
