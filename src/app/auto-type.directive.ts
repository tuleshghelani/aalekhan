import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[AutoType]'
})
export class AutoTypeDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const text = this.el.nativeElement.innerText;
    this.el.nativeElement.innerHTML = '';

    const typingSpeed = 150; // Adjust this value to control typing speed
    let index = 0;

    const typeText = () => {
      if (index < text.length) {
        this.el.nativeElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeText, typingSpeed);
      } else {
        setTimeout(() => {
          index = 0;
          this.el.nativeElement.innerHTML = '';
          typeText(); // Start typing again
        }, 2000);
      }
    };

    typeText();
  }
}