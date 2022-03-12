import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, NavigationEnd, Router} from "@angular/router";
import {SeoService} from "src/app/core/services/seo.service";
import {filter, map, mergeMap, tap} from 'rxjs/operators';
import {AppModule} from "./app.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FinancialFuture';
  loading: boolean = false;
  numberOfLoading: number = 0;
  prod: boolean;
  env: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private appModule: AppModule) {
    this.prod = appModule.environment.production;
    this.env = appModule.environment.env;
  }

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      tap(({title, description}: Data) => {
        this.seoService.setSeoData(title, description);
      })
    ).subscribe();
  }

  loadingAdd() {
    this.numberOfLoading++;
    this.loading = true;
  }

  loadingRemove() {
    this.numberOfLoading--;
    if (this.numberOfLoading < 0) {
      this.numberOfLoading = 0;
    }
    if (this.numberOfLoading === 0) {
      this.loading = false;
    }
  }
}
