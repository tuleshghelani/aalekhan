import { NgModule, AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
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
        style({ transform: 'translateX(0)', transition: '1s' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(0)', transition: '1s' }),
        animate('400ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ])
  ]
})
export class AppComponent implements OnInit {

  contactForm!: FormGroup
  carouselState = 'slideIn';
  title = 'aalekhan';

  ball: any;
  isContactDialogOpen: boolean = false
  isAboutDialogOpen: boolean = false
  mouseX = 0;
  mouseY = 0;
  ballX = 0;
  ballY = 0;
  speed = 0.1;

  budgetValue: any = 0;
  minBudget: number = 5000;
  maxBudget: number = 100000;
  step: number = 1000;

  serviceOption:string[] = ['RESEARCH','STRATEGY','IDENTITY','DIGITAL','ADVERTISING'];

  constructor() { }

  carouselItems: any[] = [
    { image: "../assets/Elon_Musk.webp", name: "Elon Musk", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" },
    { image: "../assets/jeff_bezos.webp", name: "Jeff Bezos", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" },
    { image: "../assets/sundar_pichai.jpeg", name: "Sundar Pichai", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" }
  ];

  ngOnInit() {
    this.contactForm = new FormGroup({
      first_name: new FormControl(),
      last_name: new FormControl(),
      company_name: new FormControl(),
      how_can_i_help: new FormControl(),
      current_nedd: new FormControl(),
      website_name: new FormControl(),
      any_project: new FormControl(),
      email: new FormControl(),
      contact_number: new FormControl(),
      what_want_from_us: new FormControl(),
      budget: new FormControl()
    })
    this.startCarousel();
    // this.ball = document.querySelector('.ball');
    // AOS.init();
  }

  ngAfterViewInit(){
    var video:any = document.getElementById("bgVideo");
      video.muted = true;
    this.ball = document.querySelector('.ball');
    console.log('check ball ->',this.ball)
    // this.animate();
  }

  onRangeValueChange(event:any){
    this.budgetValue = event.value
    console.log('budget value =>>',event.value,this.budgetValue)
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

  submitForm() {
    console.log('submit data =>', this.contactForm.value)
    this.contactForm.reset()
  }
  closeModel() {
    this.contactForm.reset()
  }

  openAboutUs() {
    this.isAboutDialogOpen = true;
  }

  closeAboutDialog(){
    this.isAboutDialogOpen = false;
  }

  contactDialog(){
    this.isContactDialogOpen =  true;
  }

  closeCotactDialog(){
    this.isContactDialogOpen =  false;
  }


  // Update ball position
  animate() {
    //Determine distance between ball and mouse
    let distX = this.mouseX - this.ballX;
    let distY = this.mouseY - this.ballY;

    // Find position of ball and some distance * speed
    this.ballX = this.ballX + (distX * this.speed);
    this.ballY = this.ballY + (distY * this.speed);

    this.ball.style.left = this.ballX + "px";
    this.ball.style.top = this.ballY + "px";

    requestAnimationFrame(animate);
  }

  // Move ball with cursor
  cursorMove(event:any) {
    console.log('cursor ',event.pageX,event.pageY)
    // document.addEventListener("mousemove", function (event) {
      this.mouseX = event.pageX;
      this.mouseY = event.pageY;
    // });
  }
}
