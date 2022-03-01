import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SocketService} from "@core/services/socket.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  playersInLobby: any[] = [];

  constructor(public socket: SocketService, public route: ActivatedRoute, public messageService: MessageService) {
    route.params.subscribe((params: any)=>{
    })
    socket.getRoomInfo()
    socket.roomInfo().subscribe((data: any) => this.roomInfo(data));
    socket.playerLeft().subscribe((data: any) => this.playerLeft(data));
  }

  ngOnInit(): void {
  }

  roomInfo(data: any){
    console.log(data);
  }

  playerLeft(data: any) {
    this.messageService.add({severity:'info', summary: 'Info', detail: data});
  }
}
