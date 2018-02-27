import { Component } from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Budge';
  user;
  constructor(private route: Router) {
    this.route.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (route.url == '/login' || route.url == '/create'){
            document.querySelector('#main-app').className = 'title-only';
          } else {
            document.querySelector('#main-app').className = '';
          }
        }
      });
  }
}
