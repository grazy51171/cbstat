import { Component } from '@angular/core';

declare const firebase: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cbstats';

  constructor() {
    try {
      firebase.analytics();
    } catch (err) {}
  }
}
