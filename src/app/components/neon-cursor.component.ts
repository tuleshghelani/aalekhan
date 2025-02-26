import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-neon-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="neon-cursor-container">
      <!-- Main cursor dot -->
      <div
        class="cursor-main"
        [style.transform]="'translate3d(' + (position.x - 10) + 'px,' + (position.y - 10) + 'px, 0)'"
        [ngClass]="{ 'clicking': isClicking, 'hovering': isHovering }"
      ></div>

      <!-- Trailing circle -->
      <div
        class="cursor-trail"
        [style.transform]="'translate3d(' + (position.x - 20) + 'px,' + (position.y - 20) + 'px, 0)'"
      ></div>

      <!-- Outer glow -->
      <div
        class="cursor-glow"
        [style.transform]="'translate3d(' + (position.x - 30) + 'px,' + (position.y - 30) + 'px, 0)'"
      ></div>
    </div>
  `,
  styles: [`
    :host {
      cursor: none;
    }

    body,
    a,
    button,
    input {
      cursor: none !important;
    }

    .neon-cursor-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    }

    .cursor-main {
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--secondary);
      mix-blend-mode: screen;
      pointer-events: none;
      transition: transform 0.15s ease-out;
    }

    .cursor-main.clicking {
      transform: scale(0.8);
    }

    .cursor-main.hovering {
      transform: scale(1.2);
    }

    .cursor-trail {
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: transparent;
      border: 2px solid var(--secondary);
      mix-blend-mode: screen;
      pointer-events: none;
      transition: transform 0.3s ease-out;
    }

    .cursor-glow {
      position: fixed;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(var(--secondary-rgb), 0.4) 0%,
        rgba(var(--secondary-rgb), 0.1) 50%,
        transparent 70%
      );
      mix-blend-mode: screen;
      pointer-events: none;
      transition: transform 0.45s ease-out;
    }
  `]
})
export class NeonCursorComponent implements OnInit {
  position = { x: 0, y: 0 };
  isClicking = false;
  isHovering = false;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.position = {
      x: event.clientX,
      y: event.clientY
    };
  }

  @HostListener('window:mousedown')
  onMouseDown(): void {
    this.isClicking = true;
  }

  @HostListener('window:mouseup')
  onMouseUp(): void {
    this.isClicking = false;
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.matches('a, button, input, [data-hover="true"]')) {
      this.isHovering = true;
    }
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.isHovering = false;
  }

  ngOnInit(): void {
    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
  }
}