import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit {

  constructor(private router:Router, private routeLocation:Location) { }
  screenWidth: any
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit(): void {
  }

  closeAboutDialog() {
    this.routeLocation.back();
  }

  gotHomePage(){
    this.router.navigate(['/'])
  }

  openSocialAccount(event: MouseEvent, account: string) {
    event.preventDefault();

    switch (account) {
      case 'linked-in':
        window.open('https://www.linkedin.com/in/aalekhan-branding-a7b5b8282', '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com/aalekhan_branding', '_blank');
        break;
      case 'pinterest':
        window.open('https://in.pinterest.com/aalekhan_branding/', '_blank');
        break;
      case 'behance':
        window.open('https://www.behance.net/aalekhanbrandin', '_blank');
        break;
    }
  }


}
