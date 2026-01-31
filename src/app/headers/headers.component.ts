import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @Input() screenWidth: any;
  @Input() activePage!: string;
  @Output() actionEvent = new EventEmitter<any>();
  
  isHomePage: boolean = false;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkIfHomePage();
  }

  contactDialog() {
    this.actionEvent.emit('contact');
  }

  checkIfHomePage() {
    this.isHomePage = this.router.url === '/';
  }

  openAboutUs() {
    this.actionEvent.emit('about');
  }
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
}
