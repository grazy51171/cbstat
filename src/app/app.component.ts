import { Component } from '@angular/core';
import { MainNavComponent } from './main-nav/main-nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterModule, MainNavComponent],
})
export class AppComponent {
  constructor() {}
}
