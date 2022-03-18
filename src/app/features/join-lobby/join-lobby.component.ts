import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {SocketService} from "@core/services/socket.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-join-lobby',
  templateUrl: './join-lobby.component.html',
  styleUrls: ['./join-lobby.component.scss']
})
export class JoinLobbyComponent implements OnInit, AfterViewInit, OnDestroy {

  lobbyPinInput: any;
  nicknameInput: string = '';
  roomInfoSub: any;
  getCreatedSub: any;
  notificationSub: any;
  clientInfoSub: any;
  roomExists = false;
  roomNotFoundMessage = '';

  constructor(public ngZone: NgZone, public socket: SocketService, public route: ActivatedRoute, public cookieService: CookieService, public router: Router, public messageService: MessageService) {

    this.getCreatedSub = this.socket.getCreated().subscribe((pin: any) => this.ngZone.run(() => {
      this.getCreated(pin)
    }));
    this.notificationSub = this.socket.notification().subscribe((data: any) => this.ngZone.run(() => {
      this.notification(data)
    }));
    this.roomInfoSub = this.socket.roomInfo().subscribe((data: any) => this.ngZone.run(() => {
      this.checkLobby(data)
    }));
    this.clientInfoSub = socket.clientInfo().subscribe((data: any) => this.ngZone.run(() => {
      this.clientInfo(data)
    }));
    socket.getClientInfo();
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.roomInfoSub.unsubscribe();
    this.getCreatedSub.unsubscribe();
    this.notificationSub.unsubscribe();
    this.clientInfoSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if ('E' in this.route.snapshot.queryParams) {
        switch (this.route.snapshot.queryParams['E']) {
          case 'NF':
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Lobby not found'});
            break;
          case 'CAP':
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Lobby is full'});
            break;
          case 'CLOSED':
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Lobby is closed'});
            break;
        }
      }
    });
  }

  createLobby() {
    this.socket.createLobby();
  }

  joinLobby() {
    this.router.navigate(['/lobby/' + this.lobbyPinInput.toString()]);
  }

  getCreated(pin: any) {
    this.router.navigate(['/lobby/' + pin]);
  }

  notification(data: any) {
    this.messageService.add({severity: data.severity, summary: data.header, detail: data.message});
  }

  checkLobby(data: any) {
    if (data.exists) {
      this.roomExists = true;
    } else {
      this.roomExists = false;
      this.roomNotFoundMessage = 'Lobby Not Found';
    }
  }

  clientInfo(data: any) {
    if ('pin' in data) {
      this.router.navigate(['/lobby/' + data.pin]);
    }
  }

  checkPinInput($event: any) {
    let pin = $event.originalEvent.target.value;
    if (pin.length === 4) {
      this.socket.checkRoom(pin);
    } else {
      this.roomNotFoundMessage = '';
      this.roomExists = false;
    }
  }
}
