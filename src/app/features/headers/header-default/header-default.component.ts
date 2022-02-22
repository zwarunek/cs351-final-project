import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import {ThemeService} from "@core/services/theme.service";
import {AppComponent} from "@app/app.component";

const VIEW_MODE_KEY = "view-mode";

@Component({
  selector: 'app-header-default',
  templateUrl: './header-default.component.html',
  styleUrls: ['./header-default.component.scss']
})
export class HeaderDefaultComponent {

  user?: any;
  viewMode: string = "dark";
  viewModeIcon: string = 'fa fa-solid fa-sun';
  displayHowTo: boolean = false;

  constructor(private app: AppComponent, public themeService: ThemeService, private http: HttpClient, public router: Router) {


    let viewMode = localStorage.getItem(VIEW_MODE_KEY);
    if (viewMode && (viewMode === 'dark' || viewMode === 'light')){
      this.viewMode = viewMode;
      this.themeService.switchTheme(this.viewMode);
    }
    else{
      localStorage.setItem(VIEW_MODE_KEY, this.viewMode);
    }
  }


  toggleViewMode() {
    if (this.viewMode === "dark"){
      this.viewMode = "light";
      this.viewModeIcon = 'fa fa-solid fa-moon';
    }
    else{
      this.viewMode = "dark";
      this.viewModeIcon = 'fa fa-solid fa-sun';
    }
    localStorage.setItem(VIEW_MODE_KEY, this.viewMode);
    this.themeService.switchTheme(this.viewMode);
  }

  displayHelp() {
    console.log(this.displayHowTo)
    this.displayHowTo = true;
  }

  howToClosed() {
    console.log('hello')
  }
}
