import { AfterViewInit, Component, OnInit } from '@angular/core';
// import * as fullpage from 'fullpage.js';
declare const fullpage: any; // Provide type annotation for fullpage
import * as AOS from "aos";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';

// import { Swiper } from "swiper";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(0)', transition:'1s' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(0)', transition:'1s' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ])
  ]
})
export class AppComponent implements OnInit {
  
  contactForm!:FormGroup
  constructor(){}
 
  carouselItems: any[] = [
    {image:"../assets/Elon_Musk.webp", name:"Elon Musk", details:"We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy"},
    {image:"../assets/jeff_bezos.webp", name:"Jeff Bezos", details:"We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy"},
    {image:"../assets/sundar_pichai.jpeg", name:"Sundar Pichai",details:"We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy"}
  ];
  carouselState = 'slideIn';
  title = 'aalekhan';
  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      description: new FormControl()
    })
    this.startCarousel();
    // AOS.init();
  }

  startCarousel() {
    setInterval(() => {
      this.carouselState = 'slideIn';
      setTimeout(() => {
        this.carouselItems.push(this.carouselItems.shift());
        this.carouselState = '';
      }, 400);
    }, 3000);
  }

  previousSlide() {
    this.carouselState = 'slideIn';
    setTimeout(() => {
      this.carouselItems.unshift(this.carouselItems.pop());
      this.carouselState = '';
    }, 400);
  }

  nextSlide() {
    this.carouselState = 'slideIn';
    setTimeout(() => {
      this.carouselItems.push(this.carouselItems.shift());
      this.carouselState = '';
    }, 400);
  }

  submitForm(){
    console.log('submit data =>',this.contactForm.value)
    this.contactForm.reset()
  }
  closeModel(){
    this.contactForm.reset()
  }

  openAboutUs(){
    
  }
}
