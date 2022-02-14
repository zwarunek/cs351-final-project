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

  accountInfoItems: MenuItem[] = [];
  user?: any;


  viewMode: string = "dark";

  constructor(private app: AppComponent, public themeService: ThemeService, private http: HttpClient, public router: Router) {

    let viewMode = localStorage.getItem(VIEW_MODE_KEY);
    if (viewMode){
      this.viewMode = viewMode;
      this.themeService.switchTheme(this.viewMode);
    }
    else{
      localStorage.setItem(VIEW_MODE_KEY, this.viewMode);
    }
  }


  private toggleViewMode() {
    if (this.viewMode === "dark"){
      this.viewMode = "light";
    }
    else{
      this.viewMode = "dark";
    }
    localStorage.setItem(VIEW_MODE_KEY, this.viewMode);
    this.themeService.switchTheme(this.viewMode);
  }
}
