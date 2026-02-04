import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @Input() screenWidth: any;
  @Input() activePage!: string;
  @Output() actionEvent = new EventEmitter<any>();
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Component initialization
  }

  openAboutUs(): void {
    // Emit event for parent component handling
    this.actionEvent.emit('about');
    // Also navigate directly to ensure it works
    this.router.navigate(['/about-dialog']);
  }
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
}
