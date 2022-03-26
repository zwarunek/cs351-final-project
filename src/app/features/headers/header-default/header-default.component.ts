
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import {GoogleTagManagerService} from "angular-google-tag-manager";


@Component({
  selector: 'app-header-default',
  templateUrl: './header-default.component.html',
  styleUrls: ['./header-default.component.scss']
})
export class HeaderDefaultComponent {

  displayHowTo: boolean = false;

  constructor(public router: Router,
              private gtmService: GoogleTagManagerService) {
  }

  displayHelp() {
    console.log(this.displayHowTo)
    this.displayHowTo = true;
    this.gtmService.pushTag({'event': 'display-help'});
  }
}
