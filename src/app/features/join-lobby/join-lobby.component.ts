import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {Socket, SocketIoConfig} from "ngx-socket-io";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit, AfterViewInit {

  lobbyPinInput: any;
  nicknameInput: string = '';

  constructor(public socket: SocketService, public route: ActivatedRoute, public cookieService: CookieService, public router: Router, public messageService: MessageService) {

    this.socket.getJoined().subscribe((success: any) => this.getJoined(success));
    socket.getCreated().subscribe((pin: any) => this.getCreated(pin));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((data: any) => {
      if(data.E === 'NF')
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Lobby not found'});
    });
  }

  createLobby(){
    this.socket.createLobby(this.nicknameInput);
    this.router.navigate(['/lobby']);
  }
  joinLobby(){
    this.socket.joinLobby(this.nicknameInput, this.lobbyPinInput);
  }
  getJoined(data: any){
    if(data.success)
      this.router.navigate(['/lobby']);
    else
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Lobby not found'});
  }
  getCreated(pin: number){
    this.socket.joinLobby(this.nicknameInput, pin);
  }
}
