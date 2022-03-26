import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {Router} from "@angular/router";
import {GoogleTagManagerService} from "angular-google-tag-manager";
import {ConfirmationService, MessageService} from "primeng/api";
import {SocketService} from "@core/services/socket.service";

@Component({
  selector: 'app-header-multiplayer',
  templateUrl: './header-multiplayer.component.html',
  styleUrls: ['./header-multiplayer.component.scss']
})
export class HeaderMultiplayerComponent {

  @Output() leaveGameFunction = new EventEmitter();
  user?: any;
  displayHowTo: boolean = false;

  constructor(public router: Router,
              public confirmationService: ConfirmationService,
              public messageService: MessageService,
              private gtmService: GoogleTagManagerService,
              public socket: SocketService,
              public ngZone: NgZone) {
  }

  displayHelp() {
    console.log(this.displayHowTo)
    this.displayHowTo = true;
    this.gtmService.pushTag({'event': 'display-help'});
  }

  leaveGame(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to leave?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.socket.leaveLobby();
        this.router.navigate(['/join']);
      }
    });
  }
}
