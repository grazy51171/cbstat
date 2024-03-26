import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [CommonModule],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
