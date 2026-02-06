import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { TransferState, makeStateKey } from '@angular/core';
import { HeadersComponent } from '../headers/headers.component';
import { environment } from '../../environments/environment';

const META_KEY = makeStateKey<boolean>('home-v2-meta');
const STRUCTURED_DATA_KEY = makeStateKey<string>('home-v2-structured-data');

interface WireframeBox {
  x: number;
  y: number;
  w: number;
  h: number;
  d: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
}

@Component({
  selector: 'app-home-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, HeadersComponent],
  templateUrl: './home-v2.component.html',
  styleUrls: ['./home-v2.component.scss'],
})
export class HomeV2Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasBg') canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly baseUrl = environment.baseUrl;
  screenWidth = 0;
  private animationId: number | null = null;
  private lastFrameTime = 0;
  private readonly FPS_CAP = 30;
  private readonly FRAME_INTERVAL = 1000 / this.FPS_CAP;
  private boxes: WireframeBox[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private isCanvasInView = true;
  private intersectionObserver: IntersectionObserver | null = null;
  private touchStartTime = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly TOUCH_MOVE_THRESHOLD = 10;

  constructor(
    private meta: Meta,
    private title: Title,
    private transferState: TransferState,
    private router: Router
  ) {}

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.resizeCanvas();
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.setMetaData();
    this.setStructuredData();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.setupIntersectionObserver();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    if (this.intersectionObserver && this.canvasRef?.nativeElement) {
      this.intersectionObserver.unobserve(this.canvasRef.nativeElement);
      this.intersectionObserver = null;
    }
  }

  actionEvent(event: string): void {
    if (event === 'about') {
      this.router.navigate(['/about-dialog']);
    }
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToTop(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleTouchStart(event: TouchEvent): void {
    if (event.touches?.length > 0) {
      this.touchStartTime = Date.now();
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  handleTouchEnd(event: TouchEvent, handler: () => void): void {
    if (!event.changedTouches?.length) return;
    const dx = Math.abs(event.changedTouches[0].clientX - this.touchStartX);
    const dy = Math.abs(event.changedTouches[0].clientY - this.touchStartY);
    const dt = Date.now() - this.touchStartTime;
    if (dt < 400 && dx < this.TOUCH_MOVE_THRESHOLD && dy < this.TOUCH_MOVE_THRESHOLD) {
      handler();
    }
  }

  handleTouchCancel(): void {
    this.touchStartTime = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  openSocialAccount(event: Event | null, account: string): void {
    event?.preventDefault();
    event?.stopPropagation();
    const urls: Record<string, string> = {
      'linked-in': 'https://www.linkedin.com/in/aalekhan-branding-a7b5b8282',
      instagram: 'https://www.instagram.com/aalekhan_branding',
      pinterest: 'https://in.pinterest.com/aalekhan_branding/',
      behance: 'https://www.behance.net/aalekhanbrandin',
    };
    const url = urls[account];
    if (url) window.open(url, '_blank');
  }

  navigateWithPrevent(event: Event, path: string): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.router.navigate([path]);
  }

  onCtaService = (): void => {
    void this.router.navigate(['/service']);
  };
  onCtaProjects = (): void => {
    void this.router.navigate(['/projects']);
  };
  onScrollToServices = (): void => this.scrollToSection('services-section');
  onScrollToTop = (): void => this.scrollToTop();
  onSocialLinkedIn = (): void => this.openSocialAccount(null, 'linked-in');
  onSocialPinterest = (): void => this.openSocialAccount(null, 'pinterest');
  onSocialBehance = (): void => this.openSocialAccount(null, 'behance');
  onSocialInstagram = (): void => this.openSocialAccount(null, 'instagram');

  private setMetaData(): void {
    if (this.transferState.hasKey(META_KEY)) return;
    this.title.setTitle(
      'Aalekhan - Branding, Digital Marketing & Website Development | Print Media & Identity Design'
    );
    const metaTags: MetaDefinition[] = [
      {
        name: 'description',
        content:
          'Aalekhan delivers premium branding, digital marketing, website and software development, print media and identity design. We help your brand grow with strategy and creativity.',
      },
      {
        name: 'keywords',
        content:
          'branding agency, digital marketing, website development, software development, print media, identity design, brand identity, creative agency, Aalekhan',
      },
      {
        property: 'og:title',
        content:
          'Aalekhan - Branding, Digital Marketing & Website Development',
      },
      {
        property: 'og:description',
        content:
          'Professionals focused on helping your brand grow. Branding, digital marketing, website development, print media and identity design.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Aalekhan Branding' },
    ];
    metaTags.forEach((tag) => this.meta.updateTag(tag));
    this.transferState.set(META_KEY, true);
  }

  private setStructuredData(): void {
    if (this.transferState.hasKey(STRUCTURED_DATA_KEY)) return;
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Aalekhan Branding',
      description:
        'Branding and digital marketing agency offering website development, software development, print media and identity design.',
      url: this.baseUrl,
      logo: `${this.baseUrl}/assets/aalekhan-logo.jpg`,
      sameAs: [
        'https://www.linkedin.com/in/aalekhan-branding-a7b5b8282',
        'https://www.instagram.com/aalekhan_branding',
        'https://in.pinterest.com/aalekhan_branding/',
        'https://www.behance.net/aalekhanbrandin',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Design & Marketing Services',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Branding and Identity Design' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing and Campaigns' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Design and App Development' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Print Media and Identity Design' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Creative Consulting and Development' } },
        ],
      },
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    this.transferState.set(STRUCTURED_DATA_KEY, JSON.stringify(structuredData));
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.createBoxes();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    this.createBoxes();
  }

  private createBoxes(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    this.boxes = [];
    for (let i = 0; i < 5; i++) {
      const size = 60 + Math.random() * 80;
      this.boxes.push({
        x: Math.random() * (w - size) + size / 2,
        y: Math.random() * (h - size) + size / 2,
        w: size,
        h: size * 0.6,
        d: size * 0.4,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: (Math.random() - 0.5) * 0.02,
        speedZ: (Math.random() - 0.5) * 0.015,
      });
    }
  }

  private setupIntersectionObserver(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || typeof IntersectionObserver === 'undefined') return;
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isCanvasInView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    this.intersectionObserver.observe(canvas);
  }

  private startAnimation(): void {
    const loop = (time: number): void => {
      this.animationId = requestAnimationFrame(loop);
      const elapsed = time - this.lastFrameTime;
      if (elapsed < this.FRAME_INTERVAL || !this.isCanvasInView) return;
      this.lastFrameTime = time - (elapsed % this.FRAME_INTERVAL);
      this.draw();
    };
    this.lastFrameTime = performance.now();
    this.animationId = requestAnimationFrame(loop);
  }

  private stopAnimation(): void {
    if (this.animationId != null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private draw(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.ctx) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.lineWidth = 1;

    for (const box of this.boxes) {
      box.rotX += box.speedX;
      box.rotY += box.speedY;
      box.rotZ += box.speedZ;
      const cx = box.x;
      const cy = box.y;
      const W = box.w / 2;
      const H = box.h / 2;
      const D = box.d / 2;
      const cosX = Math.cos(box.rotX);
      const sinX = Math.sin(box.rotX);
      const cosY = Math.cos(box.rotY);
      const sinY = Math.sin(box.rotY);
      const cosZ = Math.cos(box.rotZ);
      const sinZ = Math.sin(box.rotZ);
      const project = (x: number, y: number, z: number): { x: number; y: number } => {
        let xx = x * cosZ - y * sinZ;
        let yy = x * sinZ + y * cosZ;
        const z2 = xx * sinY + z * cosY;
        xx = xx * cosY - z * sinY;
        yy = yy * cosX - z2 * sinX;
        const zz = yy * sinX + z2 * cosX;
        const scale = 300 / (300 + zz);
        return { x: cx + xx * scale, y: cy + yy * scale };
      };
      const corners = [
        project(-W, -H, -D), project(W, -H, -D), project(W, H, -D), project(-W, H, -D),
        project(-W, -H, D), project(W, -H, D), project(W, H, D), project(-W, H, D),
      ];
      const [f0, f1, f2, f3, b0, b1, b2, b3] = corners;
      this.ctx.beginPath();
      this.ctx.moveTo(f0.x, f0.y);
      this.ctx.lineTo(f1.x, f1.y);
      this.ctx.lineTo(f2.x, f2.y);
      this.ctx.lineTo(f3.x, f3.y);
      this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(b0.x, b0.y);
      this.ctx.lineTo(b1.x, b1.y);
      this.ctx.lineTo(b2.x, b2.y);
      this.ctx.lineTo(b3.x, b3.y);
      this.ctx.closePath();
      this.ctx.stroke();
      for (let i = 0; i < 4; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(corners[i].x, corners[i].y);
        this.ctx.lineTo(corners[i + 4].x, corners[i + 4].y);
        this.ctx.stroke();
      }
    }
  }

  readonly services = [
    { title: 'Digital Marketing and Campaigns', desc: 'We drive growth with <strong>digital marketing</strong> and data-led campaigns that reach the right audience.' },
    { title: 'Branding and Identity Design', desc: 'From logo to full <strong>brand identity</strong>, we build brands that stand out and stay memorable.' },
    { title: 'Website Design and App Development', desc: 'Responsive <strong>website development</strong> and <strong>software</strong> solutions tailored to your business.' },
    { title: 'Print Media and Identity Design', desc: 'Brochures, packaging, and <strong>print media</strong> with consistent <strong>identity design</strong>.' },
    { title: 'Creative Consulting and Development', desc: 'Strategy and creative direction to align <strong>branding</strong> with your goals.' },
  ];

  readonly latestWorks = [
    { category: 'Print & identity', title: 'Ankur edible oils — label and packaging', desc: 'Brand identity and <strong>print media</strong> for a range of edible oil products, from label design to cohesive packaging that stands out on shelf.', alt: 'Ankur edible oils label and packaging design', img: 'assets/projects/ankur-label.jpg', link: '/projects' },
    { category: 'Website & digital', title: 'Portfolio and brand presence', desc: 'A responsive <strong>website</strong> and visual identity that reflects the brand and works across devices.', alt: 'Portfolio and brand presence project', img: 'assets/projects/Portfolio_Foy-Cover-Portfolio-min.png', link: '/projects' },
    { category: 'Branding & campaigns', title: 'Campaign and visual storytelling', desc: 'Creative direction and <strong>digital marketing</strong> assets that tell a clear story and drive engagement.', alt: 'Campaign and visual storytelling project', img: 'assets/projects/1.jpg', link: '/projects' },
  ];
}
