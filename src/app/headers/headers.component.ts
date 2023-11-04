import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @Input() screenWidth: any;
  @Input() activePage!: string
  @Output() actionEvent = new EventEmitter<any>();
  
  isHomePage: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkIfHomePage();
  }

  contactDialog() { }
  checkIfHomePage() {
    // Get the current route
    const currentRoute = this.router.url;

    // Check if the current route is the root ("/") route
    this.isHomePage = currentRoute === '/';
  }

  openAboutUs() {
    this.router.navigate(['/about-dialog'])
    // this.actionEvent.emit(true)
    // this.commonService.menuActionCall(true)
  }
  
  navigateToHome() {
    this.router.navigate(['/']); // Replace 'home' with your actual home route path
  }

}
