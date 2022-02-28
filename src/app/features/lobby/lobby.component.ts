import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SocketService} from "@core/services/socket.service";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(public socket: SocketService, public route: ActivatedRoute) {
    route.params.subscribe((params: any)=>{
      console.log(params['room'])
    })
  }

  ngOnInit(): void {
  }

}
