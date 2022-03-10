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
  players = [].constructor(this.playerCap);
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
    this.socket.roomInfo().pipe(take(1)).subscribe((data: any) => this.initialRoomCheck(data))
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
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false},
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false},
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false},
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false},
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false},
      {'name': 'Empty', 'status': 'empty', 'uuid': '', 'leader': false}
    ]
  }

  roomInfo(data: any){
    console.log('room info', data)
    if(data.exists) {
      this.setPlayers()
      for (let i = 0; i < data.players.length; i++) {
        this.players[i].name = data.players[i].nickname;
        this.players[i].uuid = data.players[i].uuid;
        this.players[i].status = data.players[i].ready?'ready':'notReady';
        this.players[i].leader = data.leader === data.players[i].uuid;
      }
      for (let i = data.players.length; i < data.players.length + data.reserved.length; i++) {
        this.players[i].name = 'Joining...';
        this.players[i].status = 'reserved';
        this.players[i].leader = false;
      }
      let fromIndex = this.players.findIndex((element: any)=>{return element.uuid === this.client.uuid});
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
    console.log('room info', data)
    this.roomInfoSub = this.socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    if(data.exists){
      if(data.players.length+data.players.length < data.capacity){
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

  unreadyUp() {
    this.socket.unreadyUp();
  }

  readyUp() {
    this.socket.readyUp()
  }
}
