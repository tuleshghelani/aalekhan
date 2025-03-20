import { NgModule, AfterViewInit, Component, OnInit, HostListener, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
import { GalleryEffectsService } from '../gallery-effects.service';

const META_KEY = makeStateKey<boolean>('meta-data');
const STRUCTURED_DATA_KEY = makeStateKey<string>('structured-data');

interface RandomCircle {
  x: string;
  y: string;
  size: number;
  image: { src: string, alt: string };
  isActive: boolean;
  showTime?: number;
  floatX?: number; // Random float X direction multiplier
  floatY?: number; // Random float Y direction multiplier
}

// Add this interface for solid circles
interface SolidCircle {
  x: string;
  y: string;
  size: number;
  isActive: boolean;
  showTime?: number;
  floatX?: number;
  floatY?: number;
}

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
    ]),
    trigger('bubbleState', [
      state('inactive', style({
        transform: 'scale(0.6)',
        opacity: 0.5
      })),
      state('active', style({
        transform: 'scale(1.5)',
        opacity: 1,
        boxShadow: '0px 0px 30px rgba(0, 170, 255, 0.9)'
      })),
      transition('inactive <=> active', animate('500ms ease-in-out'))
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly baseUrl = environment.baseUrl;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  bubbles = [
    { id: 1, top: 430, left: 600, content:'Reach' },
    { id: 2, top: 360, left: 1000, content:'Impression' },
    { id: 3, top: 100, left: 1200, content:'Revenue' }
  ];

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
  textPosition1: number = 0; // First line position
  textPosition2: number = 0; // Second line position (opposite direction)
  containerWidth: number = 0;
  textWidth: number = 0;


  @ViewChild('galleryContainer') galleryContainerRef: ElementRef | undefined;
  private galleryContainer: HTMLElement | null = null;
  private isGalleryActive: boolean = false;
  private circleShowDuration: number = 3000;
  public currentImageIndex: number = -1;
  public galleryImages = [
    { src: 'assets/all-projects/box.jpg', alt: 'Packaging Design' },
    { src: 'assets/all-projects/brochure_front.jpg', alt: 'Brochure Design' },
  
    { src: 'assets/all-projects/pusti_art_01.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/florena_post_1.jpg', alt: 'Social Media Design' },
    { src: 'assets/all-projects/letterhead_business_card.jpg', alt: 'Corporate Identity' },
    { src: 'assets/all-projects/brochure_inner_pages.jpg', alt: 'Editorial Design' },
    { src: 'assets/all-projects/pusti_art_01.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/pusti_art_02.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/pusti_art_03.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/pusti_art_04.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/pusti_art_05.jpg', alt: 'Art Direction' },
    { src: 'assets/all-projects/pusti_art_06.jpg', alt: 'Art Direction' },
  ];

  private animationTimeout: any;
  private animationDuration: number = 5000; // 5 seconds per circle (2s grow, 3s show)
  private galleryInterval: any;

  public randomCircles: RandomCircle[] = [];
  private maxActiveCircles: number = 3; // Maximum number of simultaneously active circles
  private minSize: number = 264; // 7cm equivalent in pixels at 96 DPI
  private maxSize: number = 450; // 13.5cm equivalent in pixels at 96 DPI
  private activeCircleTimeout: any;
  private circleDuration: number = 0; // Will be calculated dynamically per circle
  private growDuration: number = 700; // 0.7s grow time in milliseconds

  private resizeObserver: ResizeObserver | null = null;

  // Add these properties for solid circles
  public solidCircles: SolidCircle[] = [];
  private maxActiveSolidCircles: number = 3;
  private minSolidSize: number = 75; // 2cm equivalent in pixels
  private maxSolidSize: number = 189; // 5cm equivalent in pixels

  private solidCircleInterval: any;

  scrollPosition: number = 0;
  lastScrollTop: number = 0;
  scrollSpeed: number = 5; // Adjust this value to control scroll sensitivity

  constructor(
    private meta: Meta,
    private title: Title,
    private transferState: TransferState,
    private galleryEffects: GalleryEffectsService
  ) {
    this.initForm();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determine scroll direction and update position
    if (st > this.lastScrollTop) {
      // Scrolling down
      this.scrollPosition -= this.scrollSpeed;
    } else {
      // Scrolling up
      this.scrollPosition += this.scrollSpeed;
    }
    
    // Reset position when text moves too far
    const marqueeContent = document.querySelector('.marquee-content') as HTMLElement;
    if (marqueeContent) {
      const contentWidth = marqueeContent.offsetWidth / 3; // Divide by 3 since we have 3 copies
      
      if (Math.abs(this.scrollPosition) > contentWidth) {
        this.scrollPosition = 0;
      }
    }
    
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  ngOnInit() {
    this.setMetaData();
    this.setStructuredData();
    this.initializeAOS();
    this.onResize();
    this.preloadImages();

    // Initialize the gallery with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.initGallery();
    }, 1000);

    // Add resize observer to reposition circles when window size changes
    this.setupResizeObserver();
  }

  ngAfterViewInit() {
    var video: any = document.getElementById("bgVideo");
    if (video) {
      video.muted = true;
    }
    this.ball = document.querySelector('.ball');
    // this.drawLines();
    // this.animate();

    // Start the sequential gallery animation
    setTimeout(() => {
      this.initGallery();
    }, 1000);

    this.updateDimensions();
    window.addEventListener('resize', () => this.updateDimensions());
  }

  updateDimensions() {
    const container = document.querySelector('.scroll-container') as HTMLElement;
    const text = document.querySelector('.scroll-text-1') as HTMLElement;

    if (container && text) {
      this.containerWidth = container.offsetWidth;
      this.textWidth = text.offsetWidth;
      this.textPosition2 = this.containerWidth; // Start second text on the right
    }
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
    this.isGalleryActive = false;
    if (this.galleryContainer) {
      this.galleryEffects.removeParticleEffects(this.galleryContainer);
      const circles = this.galleryContainer.querySelectorAll('.image-circle, .solid-circle');
      circles.forEach(circle => {
        if (circle.parentNode === this.galleryContainer) {
          this.galleryContainer?.removeChild(circle);
        }
      });
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
    }

    if (this.solidCircleInterval) {
      clearInterval(this.solidCircleInterval);
    }

    if (this.activeCircleTimeout) {
      clearTimeout(this.activeCircleTimeout);
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
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

  private setupGallery(): void {
    // Preload images to ensure they're cached for the static gallery
    this.preloadGalleryImages();

    // Apply subtle particle effects to the gallery section rather than container
    const gallerySection = document.getElementById('animated-gallery');
    if (gallerySection) {
      this.galleryEffects.addParticleEffects(gallerySection);
    }

    // Add click handlers for static circles to make them interactive
    this.setupCircleInteractions();
  }

  private setupCircleInteractions(): void {
    const circles = document.querySelectorAll('.static-circle');
    circles.forEach((circle, index) => {
      circle.addEventListener('click', () => {
        // Navigate to project details or open a modal with project info
        console.log(`Circle ${index + 1} clicked`);
        // You could add logic here to open your project details
      });
    });
  }

  private preloadGalleryImages(): void {
    this.galleryImages.forEach((src, index) => {
      const img = new Image();
      img.src = src.src;
      img.onload = () => console.log(`Image ${index + 1} loaded: ${src.src}`);
      img.onerror = () => console.error(`Failed to load image ${index + 1}: ${src.src}`);
    });
  }

  public debugGallery(): void {
    console.log('Debug Gallery clicked');
    alert('Gallery debug triggered! Check if static circles are visible.');

    // List all static circles for debugging
    const circles = document.querySelectorAll('.static-circle');
    console.log(`Found ${circles.length} static circles`);

    circles.forEach((circle, index) => {
      console.log(`Circle ${index + 1}:`, circle);
    });
  }

  initGallery() {
    // Initialize the gallery container reference
    if (this.galleryContainerRef) {
      this.galleryContainer = this.galleryContainerRef.nativeElement;
    } else {
      this.galleryContainer = document.querySelector('.circle-wrapper');
    }

    // Generate the initial set of random circles
    this.generateRandomCircles();

    // Generate solid circles
    this.generateSolidCircles();

    // Start the animation cycle
    this.startCircleAnimation();

    // Start the solid circle animation
    this.startSolidCircleAnimation();

    // Apply particle effects to the gallery section
    const gallerySection = document.getElementById('animated-gallery');
    if (gallerySection) {
      this.galleryEffects.addParticleEffects(gallerySection);
    }
  }

  private generateRandomCircles() {
    // Create circles for each image
    this.randomCircles = this.galleryImages.map(image => {
      return {
        x: this.getRandomPosition(80, 20) + '%', // Stay within 20%-80% of container width
        y: this.getRandomPosition(80, 20) + '%', // Stay within 20%-80% of container height
        size: this.getRandomSize(),
        image: image,
        isActive: false
      };
    });
  }

  private getRandomPosition(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomSize(): number {
    // Get base random size (7cm-15cm)
    let size = Math.floor(Math.random() * (this.maxSize - this.minSize + 1)) + this.minSize;

    // Adjust based on screen size
    if (window.innerWidth < 768) {
      // For smaller screens, scale down circles proportionally
      const scaleFactor = Math.min(1, window.innerWidth / 1200);
      size = Math.floor(size * scaleFactor);

      // Ensure minimum size for visibility
      size = Math.max(size, 100);
    }

    return size;
  }

  private startCircleAnimation() {
    // Clear any existing animation cycle
    if (this.galleryInterval) {
      clearInterval(this.galleryInterval);
    }

    // Activate initial circles
    this.activateRandomCircles();

    // Set up interval to show new circles periodically
    this.galleryInterval = setInterval(() => {
      this.activateRandomCircles();
    }, 1500);
  }

  private activateRandomCircles() {
    // Count current active circles
    const activeCount = this.randomCircles.filter(c => c.isActive).length;

    // If we have reached the maximum number of active circles, return
    if (activeCount >= this.maxActiveCircles) {
      return;
    }

    // Find inactive circles
    const inactiveCircles = this.randomCircles.filter(c => !c.isActive);
    if (inactiveCircles.length === 0) return;

    // Calculate how many circles to activate
    const circleCount = Math.min(
      this.maxActiveCircles - activeCount,
      Math.floor(Math.random() * 2) + 1, // Activate 1-2 circles at a time
      inactiveCircles.length
    );

    for (let i = 0; i < circleCount; i++) {
      // Select a random inactive circle
      const randomIndex = Math.floor(Math.random() * inactiveCircles.length);
      const circle = inactiveCircles[randomIndex];

      // Generate new size
      circle.size = this.getRandomSize();

      // Find position without overlap
      const newPosition = this.getPositionWithoutOverlap(circle.size);
      circle.x = newPosition.x + '%';
      circle.y = newPosition.y + '%';

      // Generate random show time between 2-6 seconds
      const showTime = this.getRandomShowTime();

      // Add random float parameters for unique movement
      circle.floatX = (Math.random() * 2 - 1); // Value between -1 and 1
      circle.floatY = (Math.random() * 2 - 1); // Value between -1 and 1

      // Calculate total duration (grow + show + fade)
      const totalDuration = this.growDuration + showTime + 1000; // 0.7s grow + show time + 1s fade

      // Add the showTime as a property to the circle
      circle.showTime = showTime;

      // Activate the circle
      circle.isActive = true;

      // Schedule deactivation
      setTimeout(() => {
        circle.isActive = false;

        // Reposition the circle for next appearance after it fades out
        setTimeout(() => {
          // No need to update position immediately as it will be updated
          // when the circle becomes active again
        }, 1000);
      }, totalDuration - 1000); // Subtract fade time

      // Remove from the inactive list
      inactiveCircles.splice(randomIndex, 1);
    }
  }

  private preloadImages() {
    this.galleryImages.forEach(image => {
      const img = new Image();
      img.src = image.src;
    });
  }

  // New method to prevent circle overlap
  private getPositionWithoutOverlap(currentCircleSize: number): { x: number, y: number } {
    const containerWidth = this.galleryContainer?.clientWidth || 1000;
    const containerHeight = this.galleryContainer?.clientHeight || 500;

    // Calculate size in pixels
    const calculatedSize = currentCircleSize;

    // Maximum attempts to find non-overlapping position
    const maxAttempts = 50;
    let attempts = 0;

    // Active circles to check against
    const activeCircles = this.randomCircles.filter(c => c.isActive);

    while (attempts < maxAttempts) {
      // Use more of the available space (20%-80% of container width/height)
      const xPixels = (this.getRandomPosition(80, 20) / 100) * containerWidth;
      const yPixels = (this.getRandomPosition(80, 20) / 100) * containerHeight;

      // Check if this position would cause overlap with any active circle
      let overlapping = false;

      for (const circle of activeCircles) {
        // Convert circle position from percentage to pixels
        const circleXPixels = (parseInt(circle.x) / 100) * containerWidth;
        const circleYPixels = (parseInt(circle.y) / 100) * containerHeight;
        const circleSizePixels = circle.size;

        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(xPixels - circleXPixels, 2) +
          Math.pow(yPixels - circleYPixels, 2)
        );

        // If distance is less than sum of radii, circles overlap
        if (distance < (calculatedSize / 2) + (circleSizePixels / 2)) {
          overlapping = true;
          break;
        }
      }

      // If no overlap found, return this position
      if (!overlapping) {
        return {
          x: Math.max(20, Math.min(80, (xPixels / containerWidth) * 100)),
          y: Math.max(20, Math.min(80, (yPixels / containerHeight) * 100))
        };
      }

      attempts++;
    }

    // If we can't find a non-overlapping position after max attempts,
    // place it randomly but at least try to keep it fully in view
    return {
      x: this.getRandomPosition(80, 20),
      y: this.getRandomPosition(80, 20)
    };
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        // When container size changes, update active circles position to prevent overlap
        this.updateCirclePositions();
      });

      const gallerySection = document.getElementById('animated-gallery');
      if (gallerySection) {
        this.resizeObserver.observe(gallerySection);
      }
    }
  }

  private updateCirclePositions() {
    // Only update active circles
    const activeCircles = this.randomCircles.filter(c => c.isActive);

    // Skip if no active circles
    if (activeCircles.length === 0) return;

    // Try to reposition each circle to avoid overlaps
    activeCircles.forEach(circle => {
      const newPosition = this.getPositionWithoutOverlap(circle.size);
      circle.x = newPosition.x + '%';
      circle.y = newPosition.y + '%';
    });
  }

  // Add this method to generate a random show time between 2-6 seconds
  private getRandomShowTime(): number {
    return Math.floor(Math.random() * 4000) + 2000; // 2000-6000ms (2-6s)
  }

  // Generate solid circles
  private generateSolidCircles() {
    // Create a set of solid circles (more than we'll show at once)
    const totalSolidCircles = 10; // Create a pool of circles to use

    this.solidCircles = Array(totalSolidCircles).fill(0).map(() => {
      return {
        x: this.getRandomPosition(85, 15) + '%', // Stay within 15%-85% of container width
        y: this.getRandomPosition(85, 15) + '%', // Stay within 15%-85% of container height
        size: this.getRandomSolidSize(),
        isActive: false,
        floatX: (Math.random() * 2 - 1), // Value between -1 and 1
        floatY: (Math.random() * 2 - 1)  // Value between -1 and 1
      };
    });
  }

  // Get random size for solid circles (2-5cm)
  private getRandomSolidSize(): number {
    // Get base random size (2cm-5cm)
    let size = Math.floor(Math.random() * (this.maxSolidSize - this.minSolidSize + 1)) + this.minSolidSize;

    // Adjust based on screen size
    if (window.innerWidth < 768) {
      // For smaller screens, scale down circles proportionally
      const scaleFactor = Math.min(1, window.innerWidth / 1200);
      size = Math.floor(size * scaleFactor);

      // Ensure minimum size for visibility
      size = Math.max(size, 50);
    }

    return size;
  }

  // Start solid circle animation
  private startSolidCircleAnimation() {
    // Clear any existing animation cycle
    if (this.solidCircleInterval) {
      clearInterval(this.solidCircleInterval);
    }

    // Activate initial solid circles
    this.activateRandomSolidCircles();

    // Set up interval to show new solid circles periodically
    this.solidCircleInterval = setInterval(() => {
      this.activateRandomSolidCircles();
    }, 2000); // Slightly different timing than image circles for variety
  }

  // Activate random solid circles
  private activateRandomSolidCircles() {
    // Count current active solid circles
    const activeCount = this.solidCircles.filter(c => c.isActive).length;

    // If we have reached the maximum number of active solid circles, return
    if (activeCount >= this.maxActiveSolidCircles) {
      return;
    }

    // Find inactive solid circles
    const inactiveCircles = this.solidCircles.filter(c => !c.isActive);
    if (inactiveCircles.length === 0) return;

    // Calculate how many circles to activate
    const circleCount = Math.min(
      this.maxActiveSolidCircles - activeCount,
      Math.floor(Math.random() * 2) + 1, // Activate 1-2 circles at a time
      inactiveCircles.length
    );

    for (let i = 0; i < circleCount; i++) {
      // Select a random inactive circle
      const randomIndex = Math.floor(Math.random() * inactiveCircles.length);
      const circle = inactiveCircles[randomIndex];

      // Generate new size
      circle.size = this.getRandomSolidSize();

      // Find position without overlap with image circles (giving priority to image circles)
      const newPosition = this.getPositionWithoutOverlapForSolid(circle.size);
      circle.x = newPosition.x + '%';
      circle.y = newPosition.y + '%';

      // Generate random show time between 2-6 seconds
      const showTime = this.getRandomShowTime();

      // Add random float parameters for unique movement
      circle.floatX = (Math.random() * 2 - 1); // Value between -1 and 1
      circle.floatY = (Math.random() * 2 - 1); // Value between -1 and 1

      // Calculate total duration (grow + show + fade)
      const growTime = 200; // 0.2s grow time for solid circles
      const totalDuration = growTime + showTime + 1000; // 0.2s grow + show time + 1s fade

      // Add the showTime as a property to the circle
      circle.showTime = showTime;

      // Activate the circle
      circle.isActive = true;

      // Schedule deactivation
      setTimeout(() => {
        circle.isActive = false;

        // When a solid circle disappears, ensure an image circle appears
        setTimeout(() => {
          this.ensureImageCircleAppears();
        }, 500);
      }, totalDuration - 1000); // Subtract fade time

      // Remove from the inactive list
      inactiveCircles.splice(randomIndex, 1);
    }
  }

  // Ensure an image circle appears when a solid circle disappears
  private ensureImageCircleAppears() {
    // Count current active image circles
    const activeCount = this.randomCircles.filter(c => c.isActive).length;

    // If we already have max active circles, no need to add more
    if (activeCount >= this.maxActiveCircles) {
      return;
    }

    // Find inactive image circles
    const inactiveCircles = this.randomCircles.filter(c => !c.isActive);
    if (inactiveCircles.length === 0) return;

    // Select a random inactive circle
    const randomIndex = Math.floor(Math.random() * inactiveCircles.length);
    const circle = inactiveCircles[randomIndex];

    // Generate new size
    circle.size = this.getRandomSize();

    // Find position without overlap
    const newPosition = this.getPositionWithoutOverlap(circle.size);
    circle.x = newPosition.x + '%';
    circle.y = newPosition.y + '%';

    // Generate random show time
    const showTime = this.getRandomShowTime();

    // Add random float parameters
    circle.floatX = (Math.random() * 2 - 1);
    circle.floatY = (Math.random() * 2 - 1);

    // Add the showTime as a property
    circle.showTime = showTime;

    // Activate the circle
    circle.isActive = true;

    // Schedule deactivation
    setTimeout(() => {
      circle.isActive = false;
    }, this.growDuration + showTime);
  }

  // Position solid circles without overlapping with image circles (giving priority to image circles)
  private getPositionWithoutOverlapForSolid(currentCircleSize: number): { x: number, y: number } {
    const containerWidth = this.galleryContainer?.clientWidth || 1000;
    const containerHeight = this.galleryContainer?.clientHeight || 500;

    // Calculate size in pixels
    const calculatedSize = currentCircleSize;

    // Maximum attempts to find non-overlapping position
    const maxAttempts = 50;
    let attempts = 0;

    // Active image circles to check against (these have priority)
    const activeImageCircles = this.randomCircles.filter(c => c.isActive);

    // Active solid circles to check against
    const activeSolidCircles = this.solidCircles.filter(c => c.isActive);

    while (attempts < maxAttempts) {
      // Use more of the available space (15%-85% of container width/height)
      const xPixels = (this.getRandomPosition(85, 15) / 100) * containerWidth;
      const yPixels = (this.getRandomPosition(85, 15) / 100) * containerHeight;

      // Check if this position would cause overlap with any active image circle
      let overlapping = false;

      // First check against image circles (they have priority)
      for (const circle of activeImageCircles) {
        // Convert circle position from percentage to pixels
        const circleXPixels = (parseInt(circle.x) / 100) * containerWidth;
        const circleYPixels = (parseInt(circle.y) / 100) * containerHeight;
        const circleSizePixels = circle.size;

        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(xPixels - circleXPixels, 2) +
          Math.pow(yPixels - circleYPixels, 2)
        );

        // If distance is less than sum of radii, circles overlap
        if (distance < (calculatedSize / 2) + (circleSizePixels / 2)) {
          overlapping = true;
          break;
        }
      }

      // If already overlapping with image circles, try a new position
      if (overlapping) {
        attempts++;
        continue;
      }

      // Then check against other solid circles
      for (const circle of activeSolidCircles) {
        // Convert circle position from percentage to pixels
        const circleXPixels = (parseInt(circle.x) / 100) * containerWidth;
        const circleYPixels = (parseInt(circle.y) / 100) * containerHeight;
        const circleSizePixels = circle.size;

        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(xPixels - circleXPixels, 2) +
          Math.pow(yPixels - circleYPixels, 2)
        );

        // If distance is less than sum of radii, circles overlap
        if (distance < (calculatedSize / 2) + (circleSizePixels / 2)) {
          overlapping = true;
          break;
        }
      }

      // If no overlap found, return this position
      if (!overlapping) {
        return {
          x: Math.max(15, Math.min(85, (xPixels / containerWidth) * 100)),
          y: Math.max(15, Math.min(85, (yPixels / containerHeight) * 100))
        };
      }

      attempts++;
    }

    // If we can't find a non-overlapping position after max attempts,
    // place it randomly but at least try to keep it fully in view
    return {
      x: this.getRandomPosition(85, 15),
      y: this.getRandomPosition(85, 15)
    };
  }

  // bubbles = [
  //   { id: 1 },
  //   { id: 2 },
  //   { id: 3 }
  // ];
  selectedBubble: number | null = null;

  selectBubble(event: Event, id: number) {
    event.stopPropagation(); // Prevent outside click from triggering immediately
    this.selectedBubble = id;
    // this.drawLines();
  }

  // selectBubble(id: number) {
  //   this.selectedBubble = id;
  // }

  outsideClick(event: Event) {
    this.selectedBubble = null;
    // this.drawLines();
  }

  drawLines() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 170, 255, 0.7)';
    ctx.lineWidth = 3;

    for (let i = 0; i < this.bubbles.length; i++) {
      for (let j = i + 1; j < this.bubbles.length; j++) {
        const b1 = this.bubbles[i];
        const b2 = this.bubbles[j];
        ctx.beginPath();
        ctx.moveTo(b1.left + 60, b1.top + 60);
        ctx.lineTo(b2.left + 60, b2.top + 60);
        ctx.stroke();
      }
    }
  }
}
