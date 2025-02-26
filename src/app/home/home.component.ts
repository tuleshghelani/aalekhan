import { NgModule, AfterViewInit, Component, OnInit, HostListener, OnDestroy } from '@angular/core';
// import * as fullpage from 'fullpage.js';
declare const fullpage: any; // Provide type annotation for fullpage
import * as AOS from "aos";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { HeadersComponent } from '../headers/headers.component';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

const META_KEY = makeStateKey<boolean>('meta-data');
const STRUCTURED_DATA_KEY = makeStateKey<string>('structured-data');

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    HeadersComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit, OnDestroy {
  private readonly baseUrl = environment.baseUrl;

  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  thumbLabel = false;
  value = 0;

  contactForm!: FormGroup
  carouselState = 'slideIn';

  ball: any;
  isContactDialogOpen: boolean = false
  isAboutDialogOpen: boolean = false
  mouseX = 0;
  mouseY = 0;
  ballX = 0;
  ballY = 0;
  speed = 0.1;

  budgetValue: any = 50000;
  minBudget: number = 50000;
  maxBudget: number = 500000;
  step: number = 10000;
  screenWidth: number = 0;

  serviceOption: string[] = ['RESEARCH', 'STRATEGY', 'IDENTITY', 'DIGITAL', 'ADVERTISING'];

  constructor(
    private meta: Meta,
    private title: Title,
    private transferState: TransferState
  ) {
    this.initForm();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  carouselItems: any[] = [
    { image: "../assets/Elon_Musk.webp", name: "Elon Musk", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" },
    { image: "../assets/jeff_bezos.webp", name: "Jeff Bezos", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" },
    { image: "../assets/sundar_pichai.jpeg", name: "Sundar Pichai", details: "We Understand your brand's purpose, vision , value , audience competition, persona etc. through in-depth discovery session to establish an apt positioning strategy" }
  ];

  ngOnInit() {
    this.setMetaData();
    this.setStructuredData();
    this.initializeAOS();
    this.onResize()
  }

  ngAfterViewInit() {
    var video: any = document.getElementById("bgVideo");
    video.muted = true;
    this.ball = document.querySelector('.ball');
    // this.animate();
  }
  
  onRangeValueChange(event: any) {
    this.budgetValue = event.value
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
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

  actionEvent(event: any) {
    this.isAboutDialogOpen = event;
  }

  // closeAboutDialog() {
  //   this.isAboutDialogOpen = false;
  // }

  contactDialog() {
    this.isContactDialogOpen = true;
  }

  closeCotactDialog() {
    this.isContactDialogOpen = false;
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
  cursorMove(event: any) {
    console.log('cursor ', event.pageX, event.pageY)
    // document.addEventListener("mousemove", function (event) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
    // });
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

  private initForm() {
    this.contactForm = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      company_name: new FormControl(''),
      how_can_i_help: new FormControl(''),
      current_nedd: new FormControl(''),
      website_name: new FormControl(''),
      any_project: new FormControl(''),
      email: new FormControl(''),
      contact_number: new FormControl(''),
      what_want_from_us: new FormControl(''),
      budget: new FormControl('')
    });
  }

  ngOnDestroy() {
    this.transferState.remove(META_KEY);
    this.transferState.remove(STRUCTURED_DATA_KEY);
  }

  private setMetaData() {
    if (this.transferState.hasKey(META_KEY)) return;

    this.title.setTitle('Aalekhan - Premium Branding & Creative Design Agency & Software Development');
    
    const metaTags = [
      { name: 'description', content: 'Leading branding and creative design agency specializing in brand strategy, graphic design, web development, and digital advertising. Transform your brand with our innovative solutions.' },
      { name: 'keywords', content: 'branding agency, creative design, brand strategy, graphic design, web development, digital advertising, logo design, UI/UX design, brand identity, marketing solutions' },
      { property: 'og:title', content: 'Aalekhan - Premium Branding & Creative Design Agency' },
      { property: 'og:description', content: 'Transform your brand with our innovative design solutions and strategic branding services.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${this.baseUrl}/assets/logo/aalekhan-logo.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Aalekhan Branding' }
    ];

    metaTags.forEach(tag => this.meta.updateTag(tag as MetaDefinition));
    this.transferState.set(META_KEY, true);
  }

  private setStructuredData() {
    if (this.transferState.hasKey(STRUCTURED_DATA_KEY)) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Aalekhan Branding",
      "description": "Premium branding and creative design agency offering comprehensive brand strategy, design, and digital solutions.",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/assets/logo/aalekhan-logo.png`,
      "image": [
        `${this.baseUrl}/assets/portfolio/project1.jpg`,
        `${this.baseUrl}/assets/portfolio/project2.jpg`
      ],
      "priceRange": "₹₹₹",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://www.linkedin.com/in/aalekhan-branding-a7b5b8282",
        "https://www.instagram.com/aalekhan_branding",
        "https://in.pinterest.com/aalekhan_branding/",
        "https://www.behance.net/aalekhanbrandin"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Design Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Brand Strategy",
              "description": "Comprehensive brand strategy development and positioning"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Development",
              "description": "Custom website design and development solutions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Graphic Design",
              "description": "Professional graphic design services for print and digital media"
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    this.transferState.set(STRUCTURED_DATA_KEY, JSON.stringify(structuredData));
  }

  private initializeAOS() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 50
    });
  }
}
