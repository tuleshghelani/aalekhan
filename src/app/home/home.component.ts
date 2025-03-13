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
  private maxSize: number = 500; // 15cm equivalent in pixels at 96 DPI
  private activeCircleTimeout: any;
  private circleDuration: number = 0; // Will be calculated dynamically per circle
  private growDuration: number = 700; // 0.7s grow time in milliseconds

  private resizeObserver: ResizeObserver | null = null;

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
    
    // Start the sequential gallery animation
    setTimeout(() => {
      this.initGallery();
    }, 1000);
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
      const circles = this.galleryContainer.querySelectorAll('.image-circle');
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
    
    // Start the animation cycle
    this.startCircleAnimation();
    
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
}
