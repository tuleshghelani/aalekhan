import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.scss']
})
export class AboutDialogComponent implements OnInit, OnDestroy {
  screenWidth: any;
  private touchStartTime: number = 0;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly TOUCH_DELAY = 300; // Maximum time for a tap (ms)
  private readonly TOUCH_MOVE_THRESHOLD = 10; // Maximum movement for a tap (px)

  constructor(private router: Router, private routeLocation: Location, private dialog: MatDialog) { }

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (event instanceof KeyboardEvent) {
      this.closeAboutDialog();
    }
  }

  @HostListener('document:touchend', ['$event'])
  onDocumentTouchEnd(_event: TouchEvent): void {
    this.clearTouchState();
  }

  private clearTouchState(): void {
    this.touchStartTime = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    // Prevent body scroll when dialog is open
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restore body scroll when dialog is closed
    document.body.style.overflow = '';
  }

  closeAboutDialog(): void {
    this.routeLocation.back();
  }

  gotHomePage(): void {
    this.navigateToPage('/');
  }

  navigateToPage(url: string, event?: Event): void {
    // Prevent default form submission behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Navigate to the route; do not call closeAboutDialog() (location.back()) here,
    // as that would go back in history to /about-dialog and undo the navigation.
    this.router.navigate([url]);
  }

  handleTouchStart(event: TouchEvent): void {
    if (event.touches && event.touches.length > 0) {
      this.touchStartTime = Date.now();
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  handleTouchCancel(): void {
    this.clearTouchState();
  }

  handleTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches || event.changedTouches.length === 0) {
      return;
    }

    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const touchMoveX = Math.abs(touchEndX - this.touchStartX);
    const touchMoveY = Math.abs(touchEndY - this.touchStartY);

    // Check if it's a tap (not a swipe or long press)
    if (touchDuration < this.TOUCH_DELAY && 
        touchMoveX < this.TOUCH_MOVE_THRESHOLD && 
        touchMoveY < this.TOUCH_MOVE_THRESHOLD) {
      // Prevent default to avoid double-tap zoom on iOS
      event.preventDefault();
      
      // Get the target element and trigger click
      const target = event.target as HTMLElement;
      const linkElement = target.closest('a');
      
      if (linkElement) {
        // Trigger navigation if it's a navigation link
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        linkElement.dispatchEvent(clickEvent);
      }
    }
  }

  openSocialAccount(event: MouseEvent | TouchEvent, account: string): void {
    event.preventDefault();
    event.stopPropagation();

    let url = '';
    switch (account) {
      case 'linked-in':
        url = 'https://www.linkedin.com/in/aalekhan-branding-a7b5b8282';
        break;
      case 'instagram':
        url = 'https://www.instagram.com/aalekhan_branding';
        break;
      case 'pinterest':
        url = 'https://in.pinterest.com/aalekhan_branding/';
        break;
      case 'behance':
        url = 'https://www.behance.net/aalekhanbrandin';
        break;
      default:
        return;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  openAllProjects(url: string): void {
    this.navigateToPage(url);
  }
}
