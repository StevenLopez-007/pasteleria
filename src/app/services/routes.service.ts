import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  initRouteConfig(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      switchMap(route => route.data),
      map(data => data['title']))
      .subscribe(dataTitle => {
        const title = dataTitle?`${environment.name} - ${dataTitle}`:`${environment.name}`
        this.title.setTitle(title);
      });
  }
}
