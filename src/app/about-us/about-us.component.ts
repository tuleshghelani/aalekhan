import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import * as Aos from 'aos';


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, HeadersComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  screenWidth: number;

  constructor() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
    Aos.init();
  }
}
